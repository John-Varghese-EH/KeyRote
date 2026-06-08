import { NextRequest, NextResponse } from 'next/server';

const PROXY_ADMIN_URL = process.env.PROXY_ADMIN_URL || 'http://localhost:3000';
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

async function forwardRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const pathArray = (await params).path;
  const path = pathArray.join('/');
  const searchParams = req.nextUrl.search;
  
  const targetUrl = `${PROXY_ADMIN_URL}/admin/${path}${searchParams}`;
  
  const headers = new Headers(req.headers);
  headers.set('Authorization', `Bearer ${ADMIN_SECRET}`);
  // Don't forward the host header so fetch uses the target URL's host
  headers.delete('host');
  
  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req.body;
      // @ts-ignore
      fetchOptions.duplex = 'half';
    }

    const response = await fetch(targetUrl, fetchOptions);
    
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding'); // Let Next.js handle encoding
    
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: true, message: 'Failed to connect to KeyRote Proxy' }, { status: 502 });
  }
}

export const GET = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const PATCH = forwardRequest;
export const DELETE = forwardRequest;
