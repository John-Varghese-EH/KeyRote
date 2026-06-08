export async function validateToken(request: Request, env: Record<string, any>): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.substring(7);
  const expected = env.PROXY_SECRET;

  if (!expected || token.length !== expected.length) return false;

  // Use Web Crypto API for constant time comparison
  const encoder = new TextEncoder();
  const a = encoder.encode(token);
  const b = encoder.encode(expected);

  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}
