import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: 'Backend URL is not configured' },
      { status: 500 },
    );
  }

  try {
    const cookie = req.headers.get('cookie') ?? '';

    const apiRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    const data = await apiRes.json();

    const response = NextResponse.json(data, {
      status: apiRes.status,
    });

    const setCookies = apiRes.headers.getSetCookie();

    for (const cookie of setCookies) {
      response.headers.append('Set-Cookie', cookie);
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Authentication server is unavailable' },
      { status: 503 },
    );
  }
}