import { FastifyInstance } from 'fastify';
import { UpstreamErrorCategory } from '../errors';
import { errorStore } from '../errorStore';

export function registerErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler(async (error, request, reply) => {
    // Determine category if it's a custom error, otherwise UNKNOWN
    let category: UpstreamErrorCategory = 'UNKNOWN';
    let code = 'UNKNOWN_ERROR';
    let status = 500;

    // Fastify handles validation errors with statusCode 400
    if (error.validation) {
      category = 'BAD_REQUEST';
      code = 'VALIDATION_ERROR';
      status = 400;
    } else if (error.statusCode === 429) {
      category = 'RATE_LIMITED';
      code = 'RATE_LIMITED';
      status = 429;
    } else if (error.statusCode) {
      status = error.statusCode;
      if (status >= 500) {
        category = 'UPSTREAM_SERVER';
        code = 'UPSTREAM_SERVER';
      } else if (status === 400) {
        category = 'BAD_REQUEST';
        code = 'BAD_REQUEST';
      }
    }

    const isProduction = process.env.NODE_ENV === 'production';
    
    // Log to error store if it's not a generic client validation/rate limit
    if (category !== 'BAD_REQUEST' && category !== 'RATE_LIMITED') {
      const authHeader = request.headers['authorization'];
      let clientToken = 'unknown';
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const crypto = require('crypto');
        clientToken = 'sha256:' + crypto.createHash('sha256').update(authHeader.substring(7)).digest('hex');
      }

      await errorStore.pushError({
        category,
        httpStatus: status,
        upstream: 'internal', // Unknown, it's an internal fastify error not an upstream fetch error
        keyHint: 'N/A',
        message: error.message,
        requestId: request.id,
        clientToken,
      });
      
      request.log.error({ err: error, requestId: request.id }, 'Unhandled Proxy Error');
    }

    const payload: any = {
      error: true,
      code,
      message: isProduction && status >= 500 ? 'Internal Server Error' : error.message,
      requestId: request.id
    };

    reply.status(status).send(payload);
  });
}
