import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

type RouteContext = {
  params: Promise<{ articleId: string }>;
};

type RequestMethod = "POST" | "DELETE";

// Передаэмо запит разом з куками користувача на бекенд, щоб додати або видалити статтю з його збережених.
async function updateSavedArticle(
  request: NextRequest,
  context: RouteContext,
  method: RequestMethod,
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "Backend URL is not configured" },
      { status: 500 },
    );
  }

  const { articleId } = await context.params;
  const cookie = request.headers.get("cookie") ?? "";

  try {
    const response = await fetch(`${BACKEND_URL}/users/saved/${articleId}`, {
      method,
      headers: {
        Cookie: cookie,
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({
      message: "Unable to update saved articles",
    }));

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Authentication server is unavailable" },
      { status: 503 },
    );
  }
}

// Додавання статті до збережених.
export async function POST(request: NextRequest, context: RouteContext) {
  return updateSavedArticle(request, context, "POST");
}

// Видалення статті зі збережених.
export async function DELETE(request: NextRequest, context: RouteContext) {
  return updateSavedArticle(request, context, "DELETE");
}
