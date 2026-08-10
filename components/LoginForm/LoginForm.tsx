"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import PasswordField from "@/components/PasswordField/PasswordField";
import Button from "@/components/Button/Button";
import ErrorNotification from "../ErrorNotification/ErrorNotification";
import FormField from "../FormField/FormField";
import css from "./LoginForm.module.css";

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .max(64, "Email must contain no more than 64 characters")
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .min(8, "Password must contain at least 8 characters")
    .max(64, "Password must contain no more than 64 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setSubmitError("");

      const email = values.email.trim().toLowerCase();

      try {
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password: values.password,
          }),
        });

        if (!loginResponse.ok) {
          const data = await loginResponse.json().catch(() => null);

          throw new Error(data?.message ?? "User not found or password is incorrect.");
        }

        router.replace("/");
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "User not found. Please try again.",
        );
      }
    },
  });

  return (
    <>
      <ErrorNotification message={submitError} onClose={() => setSubmitError("")} />

      <form noValidate className={css.form} onSubmit={formik.handleSubmit}>
        <FormField
          id="email"
          name="email"
          type="email"
          label="Enter your email address"
          placeholder="email@gmail.com"
          autoComplete="email"
          maxLength={64}
          value={formik.values.email}
          error={formik.touched.email ? formik.errors.email : undefined}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <PasswordField
          id="password"
          name="password"
          label="Enter a password"
          placeholder="***********"
          minLength={8}
          maxLength={64}
          autoComplete="current-password"
          value={formik.values.password}
          error={formik.touched.password ? formik.errors.password : undefined}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Button
          className={css.submitbtn}
          type="submit"
          fullWidth
          isLoading={formik.isSubmitting}
          loadingText="Login..."
          size="md"
        >
          Login
        </Button>
      </form>
    </>
  );
}
