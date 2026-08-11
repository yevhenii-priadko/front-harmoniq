import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: 'Backend URL is not configured' },
      { status: 500 },
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;

    const apiRes = await fetch(
      `${BACKEND_URL}/articles?${searchParams.toString()}`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );

    const data = await apiRes.json();

    return NextResponse.json(data, {
      status: apiRes.status,
    });
  } catch {
    return NextResponse.json(
      { message: 'Articles server is unavailable' },
      { status: 503 },
    );
  }
}