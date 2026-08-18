import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../../../api";

export async function PATCH(request: Request) {
  try {
    const formData = await request.formData();
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const response = await api.patch("/users/me", formData, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      return NextResponse.json(
        {
          message: error.response?.data?.message ?? "Unable to update your profile.",
        },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Unable to update your profile." },
      { status: 500 },
    );
  }
}
