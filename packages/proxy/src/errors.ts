export type UpstreamErrorCategory =
  | 'RATE_LIMITED'       // 429 → rotate key, exponential backoff
  | 'AUTH_FAILURE'       // 401 / 403 → mark key dead, alert
  | 'BAD_REQUEST'        // 400 → client error, do NOT rotate, return to caller as-is
  | 'UPSTREAM_SERVER'    // 500 / 502 / 503 / 504 → retry same key up to MAX_RETRY_ATTEMPTS, then rotate
  | 'TIMEOUT'            // fetch AbortError / timeout → retry with backoff
  | 'NETWORK'            // DNS failure, ECONNREFUSED, ECONNRESET → retry with backoff
  | 'MALFORMED_RESPONSE' // upstream returned non-JSON when JSON expected → log + surface
  | 'POOL_EXHAUSTED'     // zero healthy keys remain → 503 to client + alert
  | 'UNKNOWN';           // catch-all → log full error, surface to error store

/**
 * Classify a fetch error or a response into an UpstreamErrorCategory.
 */
export function classifyUpstreamError(res?: Response, err?: any): UpstreamErrorCategory {
  if (err) {
    if (err.name === 'AbortError' || err.code === 'UND_ERR_HEADERS_TIMEOUT') {
      return 'TIMEOUT';
    }
    if (['ECONNREFUSED', 'ECONNRESET', 'EAI_AGAIN', 'ENOTFOUND'].includes(err.code)) {
      return 'NETWORK';
    }
    // If it's a known fetch syntax/malformed error that isn't network level
    if (err.name === 'SyntaxError') {
      return 'MALFORMED_RESPONSE';
    }
    return 'UNKNOWN';
  }

  if (res) {
    if (res.status === 429) return 'RATE_LIMITED';
    if (res.status === 401 || res.status === 403) return 'AUTH_FAILURE';
    if (res.status === 400) return 'BAD_REQUEST';
    if (res.status >= 500 && res.status <= 504) return 'UPSTREAM_SERVER';
  }

  return 'UNKNOWN';
}
