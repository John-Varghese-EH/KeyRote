export type UpstreamErrorCategory = 
  | 'POOL_EXHAUSTED'
  | 'RATE_LIMITED'
  | 'AUTH_FAILURE'
  | 'UPSTREAM_SERVER'
  | 'BAD_REQUEST'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'UNKNOWN';

export function classifyUpstreamError(res?: Response, err?: any): UpstreamErrorCategory {
  if (err) {
    if (err.name === 'AbortError' || err.name === 'TimeoutError') return 'TIMEOUT';
    if (err.message?.includes('fetch failed') || err.message?.includes('network')) return 'NETWORK';
    return 'UNKNOWN';
  }

  if (res) {
    if (res.status === 429) return 'RATE_LIMITED';
    if (res.status === 401 || res.status === 403) return 'AUTH_FAILURE';
    if (res.status >= 500) return 'UPSTREAM_SERVER';
    if (res.status >= 400 && res.status < 500) return 'BAD_REQUEST';
  }

  return 'UNKNOWN';
}
