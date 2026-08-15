"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import PasswordField from "@/components/PasswordField/PasswordField";
import PasswordStrengthBar from "@/components/PasswordStrengthBar/PasswordStrengthBar";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./RegisterForm.module.css";

const registerSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(32, "Name must contain no more than 32 characters")
    .required("Name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .max(64, "Email must contain no more than 64 characters")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .max(64, "Password must contain no more than 64 characters")
    .required("Password is required"),

  repeatPassword: Yup.string()
    .required("Repeat your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function RegisterForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    },

    validationSchema: registerSchema,

    onSubmit: async (values) => {
      setSubmitError("");

      const email = values.email.trim().toLowerCase();

      try {
        // Спочатку реєструємо користувача.
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username.trim(),
            email,
            password: values.password,
          }),
        });

        const registerData = (await registerResponse.json().catch(() => null)) as {
          message?: string;
        } | null;

        if (!registerResponse.ok) {
          if (registerResponse.status === 409) {
            throw new Error("An account with this email is already registered.");
          }

          throw new Error(
            registerData?.message ?? "Unable to create your account. Please try again.",
          );
        }

        // Після успішної реєстрації автоматично виконуємо login.
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

        const loginData = await loginResponse.json().catch(() => null);

        if (!loginResponse.ok) {
          throw new Error(
            "Your account was created, but automatic sign-in failed. Please log in.",
          );
        }

        // ⚠️ Без цього Header не дізнається про авторизацію до наступного
        // reload/AuthSessionChecker — той самий баг, що чинили в LoginForm.
        if (loginData?.user) {
          useAuthStore.getState().setUser(loginData.user);
        }

        // Переходимо далі тільки після отримання сесії.
        router.push("/photo");
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Unable to create your account. Please try again.",
        );
      }
    },
  });

  return (
    <>
      <ErrorNotification message={submitError} onClose={() => setSubmitError("")} />

      <form className={styles.form} noValidate onSubmit={formik.handleSubmit}>
        <FormField
          id="username"
          name="username"
          type="text"
          label="Enter your name"
          placeholder="Max"
          autoComplete="name"
          maxLength={32}
          value={formik.values.username}
          error={formik.touched.username ? formik.errors.username : undefined}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

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
          label="Create a strong password"
          placeholder="********"
          autoComplete="new-password"
          maxLength={64}
          value={formik.values.password}
          error={formik.touched.password ? formik.errors.password : undefined}
          helper={<PasswordStrengthBar password={formik.values.password} />}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <PasswordField
          id="repeatPassword"
          name="repeatPassword"
          label="Repeat your password"
          placeholder="********"
          autoComplete="new-password"
          maxLength={64}
          value={formik.values.repeatPassword}
          error={formik.touched.repeatPassword ? formik.errors.repeatPassword : undefined}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Button
          className={styles.submitButton}
          type="submit"
          fullWidth
          isLoading={formik.isSubmitting}
          loadingText="Creating account..."
          size="md"
        >
          Create account
        </Button>
      </form>
    </>
  );
}
