import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: 'Backend URL is not configured' },
      { status: 500 },
    );
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);

  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('perPage') ?? '12';

  try {
    console.log('FRONT ROUTE PAGE:', page);

    console.log('FRONT ROUTE PER PAGE:', perPage);


    const response = await fetch(
      `${BACKEND_URL}/users/${id}/articles?page=${page}&perPage=${perPage}`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: 'Unable to load user articles' },
      { status: 503 },
    );
  }
}