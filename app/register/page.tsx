import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import styles from "./RegisterPage.module.css";

export const metadata: Metadata = {
  title: "Register | Harmoniq",
  description: "Create your Harmoniq account.",
  openGraph: {
    title: "Register | Harmoniq",
    description: "Create your Harmoniq account.",
  },
};

export default function RegisterPage() {
  return (
    <section className={styles.page} aria-labelledby="register-title">
      <div className={styles.card}>
        <h1 className={styles.title} id="register-title">
          Register
        </h1>

        <p className={styles.description}>
          Join our community of mindfulness
          <br />
          and wellbeing!
        </p>

        <RegisterForm />

        <p className={styles.loginPrompt}>
          Already have an account?{" "}
          <Link className={styles.loginLink} href="/login">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
