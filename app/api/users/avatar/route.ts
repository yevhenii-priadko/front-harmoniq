import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../../api";

export async function PATCH(request: Request) {
  try {
    // Отримуємо FormData з запиту (файл аватара).
    const formData = await request.formData();

    // Отримуємо cookies авторизованного користувача.
    const cookieStore = await cookies();

    // ⚠️ cookieStore.toString() НЕ повертає валідний рядок "name=value; ..." —
    // збираємо вручну через getAll(), інакше бекенд не побачить сесію.
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    // Виконуємо PATCH-запит на бекенд для завантаження аватара.
    const response = await api.patch("/users/avatar", formData, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      return NextResponse.json(
        {
          message: error.response?.data?.message ?? "Unable to upload your photo.",
        },
        {
          status: error.response?.status ?? 500,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Unable to upload your photo.",
      },
      {
        status: 500,
      },
    );
  }
}
