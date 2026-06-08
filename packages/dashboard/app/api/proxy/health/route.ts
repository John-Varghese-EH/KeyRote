import { NextResponse } from 'next/server';

export async function GET() {
  const PROXY_ADMIN_URL = process.env.PROXY_ADMIN_URL || 'http://localhost:3000';
  const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

  try {
    const res = await fetch(`${PROXY_ADMIN_URL}/admin/health`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_SECRET}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch health: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Health proxy error:', error);
    return NextResponse.json({ error: true, message: error.message }, { status: 502 });
  }
}
