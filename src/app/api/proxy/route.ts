import { NextResponse } from 'next/server';

const BASE_URL = 'https://moviex-flip.vercel.app';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
  }

  // Validate endpoint to prevent path traversal
  if (endpoint.includes('..') || endpoint.startsWith('/')) {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeout);
    
    if (!res.ok) {
      return NextResponse.json({ 
        error: `API error: ${res.status}`,
        endpoint 
      }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch';
    console.error('Proxy error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}