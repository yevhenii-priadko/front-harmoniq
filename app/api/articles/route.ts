import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "../api";
import { logErrorResponse } from "../_utils/utils";

// GET прокидує ВСІ query-параметри як є (page/perPage/filter/sortOrder тощо) —
// так фронту не треба перелічувати кожен параметр окремо, і фільтр
// "Popular"/"All" з ArticlesPage (див. backend PR #13) працює без додаткових правок тут.
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const searchParams = request.nextUrl.searchParams.toString();

    const res = await api.get(`/articles${searchParams ? `?${searchParams}` : ""}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Приймає звичайний JSON (title/description/date/author/photo-URL) —
// бекенд поки не вміє приймати файл, див. коментар у lib/api/clientApi.ts
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const res = await api.post("/articles", body, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
