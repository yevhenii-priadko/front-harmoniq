import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const AUTH_COOKIE_NAMES = ["sessionId", "accessToken", "refreshToken"];

const clearAuthCookies = (response: NextResponse) => {
  for (const name of AUTH_COOKIE_NAMES) {
    response.cookies.set(name, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "lax",
    });
  }
};

export async function POST() {
  if (!BACKEND_URL) {
    const response = NextResponse.json(
      { message: "Backend URL is not configured" },
      { status: 500 },
    );
    clearAuthCookies(response);
    return response;
  }

  const cookieStore = await cookies();

  try {
    const apiRes = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const data =
      apiRes.status === 204
        ? { message: "Logged out" }
        : await apiRes.json().catch(() => ({ message: "Logout failed" }));

    const response = NextResponse.json(data, {
      status: apiRes.ok ? 200 : apiRes.status,
    });

    clearAuthCookies(response);
    return response;
  } catch {
    const response = NextResponse.json(
      { message: "Authentication server is unavailable" },
      { status: 503 },
    );
    clearAuthCookies(response);
    return response;
  }
}
