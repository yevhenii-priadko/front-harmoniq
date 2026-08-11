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

    // Виконуємо PATCH-запит на бекенд для завантаження аватара.
    const response = await api.patch("/users/avatar", formData, {
      headers: {
        Cookie: cookieStore.toString(),
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
