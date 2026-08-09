import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

// API-роут для обробки POST-запитів на реєстрацію користувача.
export async function POST(request: Request) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "Backend URL is not configured" },
      { status: 500 },
    );
  }

  let payload: RegisterPayload;

  // Спроба розпарсити JSON з тіла запиту. Якщо не вдається, повертаємо помилку 400.
  try {
    payload = (await request.json()) as RegisterPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (
    typeof payload.username !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.password !== "string"
  ) {
    return NextResponse.json({ message: "Invalid registration data" }, { status: 400 });
  }

  // Перевірка наявності всіх необхідних полів у payload
  try {
    const backendResponse = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: payload.username,
        email: payload.email,
        password: payload.password,
      }),
      cache: "no-store",
    });

    // Перевірка статусу відповіді від бекенду
    const responseData = await backendResponse.json().catch(() => null);

    if (!responseData) {
      return NextResponse.json(
        { message: "Authentication server returned an invalid response" },
        { status: 502 },
      );
    }

    // Повертаємо відповідь від бекенду клієнту, зберігаючи статус-код.
    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Authentication server is unavailable" },
      { status: 503 },
    );
  }
}
