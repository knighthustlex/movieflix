import { NextResponse } from 'next/server';

const BASE_URL = 'https://moviex-flip.vercel.app';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
  }

  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}