import { FastifyRequest, FastifyReply } from 'fastify';
import { config } from '../config';

export async function corsMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const origin = request.headers.origin;
  const clientIp = request.ip; // Fastify request.ip

  // CORS validation
  if (config.ALLOWED_ORIGINS.length > 0) {
    if (!origin || !config.ALLOWED_ORIGINS.includes(origin)) {
      // Fastify standard is to reject, but proxy might just not append the header or return 403
      // We will reject with 403 for strictly restricted origins
      reply.status(403).send({ error: true, message: 'Origin not allowed' });
      return;
    }
    // If allowed, append CORS header
    reply.header('Access-Control-Allow-Origin', origin);
  } else {
    // Default to allow all if not configured
    reply.header('Access-Control-Allow-Origin', '*');
  }

  // Handle preflight
  if (request.method === 'OPTIONS') {
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return reply.status(204).send();
  }

  // IP Whitelist validation
  if (config.ALLOWED_IPS.length > 0) {
    if (!config.ALLOWED_IPS.includes(clientIp)) {
      return reply.status(403).send({ error: true, message: 'IP not allowed' });
    }
  }
}
