import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: 'Backend URL is not configured' },
      { status: 500 },
    );
  }

  const cookie = req.headers.get('cookie') ?? '';
  const { searchParams } = new URL(req.url);

  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('perPage') ?? '12';

  try {
    const response = await fetch(
      `${BACKEND_URL}/users/me/saved-articles?page=${page}&perPage=${perPage}`,
      {
        method: 'GET',
        headers: {
          Cookie: cookie,
        },
        cache: 'no-store',
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: 'Unable to load saved articles' },
      { status: 503 },
    );
  }
}