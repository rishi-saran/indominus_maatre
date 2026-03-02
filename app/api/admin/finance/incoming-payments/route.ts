import { NextResponse } from 'next/server';

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(req: Request) {
  try {
    const incomingHeaders: Record<string, string> = {};
    const auth = req.headers.get('authorization');
    const cookie = req.headers.get('cookie');
    const adminToken = req.headers.get('x-admin-token');
    if (auth) incomingHeaders['authorization'] = auth;
    if (cookie) incomingHeaders['cookie'] = cookie;
    if (adminToken) incomingHeaders['x-admin-token'] = adminToken;

    const url = new URL(req.url);
    const search = url.search ? url.search : '';
    const backendUrl = `${BACKEND_BASE}/admin/finance/incoming-payments${search}`;

    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        ...incomingHeaders,
      },
    });

    const body = await res.text();
    const headers: Record<string, string> = {};
    const contentType = res.headers.get('content-type');
    if (contentType) headers['content-type'] = contentType;

    return new NextResponse(body, { status: res.status, headers });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message || 'Proxy error' }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
}
