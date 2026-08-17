import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "../../api";
import { logErrorResponse } from "../../_utils/utils";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();

    const res = await api.get(`/articles/${id}`, {
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

// PATCH /articles/:id реалізовано на бекенді (PR #21 + фікс #22, #23).
// Якщо юзер міняє фото при редагуванні статті, клієнт шле сюди
// multipart/form-data (як і на створенні статті) — тоді форвардимо
// FormData як є, без ручного Content-Type (щоб axios сам виставив
// правильний boundary). Якщо фото не міняли — клієнт шле звичайний JSON.
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const contentType = request.headers.get("content-type") ?? "";
    const isMultipart = contentType.includes("multipart/form-data");

    const body = isMultipart ? await request.formData() : await request.json();

    const res = await api.patch(`/articles/${id}`, body, {
      headers: {
        Cookie: cookieStore.toString(),
        ...(isMultipart ? {} : { "Content-Type": "application/json" }),
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
