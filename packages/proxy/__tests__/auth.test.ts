import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock config before importing auth
vi.mock('../src/config', () => ({
  config: {
    PROXY_SECRET: 'testsecret123',
    ALLOWED_ORIGINS: [],
    ALLOWED_IPS: [],
    MAX_REQUESTS_PER_MINUTE: 60,
  }
}));

import { authMiddleware } from '../src/middleware/auth';
import { FastifyRequest, FastifyReply } from 'fastify';

describe('Auth Middleware', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let statusMock: any;
  let sendMock: any;

  beforeEach(() => {
    sendMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ send: sendMock });
    mockReply = {
      status: statusMock,
    };
  });

  it('should return 401 if authorization header is missing', async () => {
    mockRequest = { headers: {} };
    await authMiddleware(mockRequest as FastifyRequest, mockReply as FastifyReply);
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalled();
  });

  it('should return 401 if token is incorrect', async () => {
    mockRequest = { headers: { authorization: 'Bearer wrongtoken' } };
    await authMiddleware(mockRequest as FastifyRequest, mockReply as FastifyReply);
    expect(statusMock).toHaveBeenCalledWith(401);
  });

  it('should pass if token is correct', async () => {
    mockRequest = { headers: { authorization: 'Bearer testsecret123' } };
    const result = await authMiddleware(mockRequest as FastifyRequest, mockReply as FastifyReply);
    expect(result).toBeUndefined(); // fastify hook passes if it returns undefined
    expect(statusMock).not.toHaveBeenCalled();
  });
});
