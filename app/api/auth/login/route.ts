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
    // Відправляємо запит на backend.
    const apiRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await apiRes.json();

    // Створюємо відповідь Next.js зі статусом backend.
    const response = NextResponse.json(data, {
      status: apiRes.status,
    });

    // Отримуємо всі cookies, які повернув backend.
    const setCookies = apiRes.headers.getSetCookie();

    // Передаємо cookies браузеру.
    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: "Authentication server is unavailable" },
      { status: 503 },
    );
  }
}
