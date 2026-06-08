import { FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import { config } from '../config';

/**
 * Validates the Bearer token in the Authorization header.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send(); // No body on failure as per spec
  }

  const token = authHeader.substring(7);

  // Pad or slice to ensure equal length for timingSafeEqual, though ideally
  // both should be the same length if it's the correct token.
  // A standard way to compare arbitrary length strings in constant time:
  const tokenBuffer = Buffer.from(token);
  const secretBuffer = Buffer.from(config.PROXY_SECRET);

  if (tokenBuffer.length !== secretBuffer.length) {
    return reply.status(401).send();
  }

  if (!crypto.timingSafeEqual(tokenBuffer, secretBuffer)) {
    return reply.status(401).send();
  }
}
