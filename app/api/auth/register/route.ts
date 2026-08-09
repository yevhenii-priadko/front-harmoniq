import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "Backend URL is not configured" },
      { status: 500 },
    );
  }

  let body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  try {
    // Відправляємо дані реєстрації на backend.
    const apiRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    // Отримуємо відповідь backend.
    const data = await apiRes.json();

    // Повертаємо дані та зберігаємо статус backend.
    return NextResponse.json(data, {
      status: apiRes.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Authentication server is unavailable" },
      { status: 503 },
    );
  }
}
