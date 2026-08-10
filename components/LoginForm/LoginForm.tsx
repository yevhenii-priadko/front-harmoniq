'use client';

import { useFormik } from 'formik';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import css from './LoginForm.module.css';
import PasswordField from '@/components/PasswordField/PasswordField';
import Button from '@/components/Button/Button';

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Email a valid email addresss')
    .max(64, 'Email must contain no more than 64 characters')
    .required('Email is required'),
  password: Yup.string()
    .trim()
    .min(8, 'Password must contain at least 8 characters')
    .max(64, 'Password must contain no more than 64 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setSubmitError('');

      const email = values.email.trim().toLowerCase();

      try {
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            password: values.password,
          }),
        });

        if (!loginResponse.ok) {
          throw new Error('');
        }
        router.push('/authors');
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'User not found. Please try again.',
        );
      }
    },
  });

  return (
    <>
      {submitError && (
        <div className={css.notification} role="alert">
          <p>{submitError}</p>

          <button
            className={css.notificationClose}
            type="button"
            aria-label="Close error message"
            onClick={() => setSubmitError('')}
          >
            <svg className={css.closeIcon} aria-hidden="true">
              <use href="/sprite.svg#icon-close-small" />
            </svg>
          </button>
        </div>
      )}
      <form noValidate className="" onSubmit={formik.handleSubmit}>
        <PasswordField
          id="password"
          name="password"
          label="Enter a password"
          placeholder="***********"
          maxLength={64}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Button
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
  // <Form className="" onSubmit={() => {}}>
  //   <div className={css.main_container_form}>
  //     <div className={css.container_form}>
  //       <label className={css.label_form} htmlFor="email">
  //         Enter your email address
  //       </label>
  //       <Field
  //         id="email"
  //         type="email"
  //         name="email"
  //         className={css.field_from}
  //         placeholder="email@gmail.com"
  //         required
  //       />
  //     </div>
  //     <div className={css.container_form}>
  //       <label className={css.label_form} htmlFor="password">
  //         Enter a password
  //       </label>
  //       <Field
  //         id="password"
  //         type="password"
  //         name="password"
  //         className={css.field_from}
  //         required
  //       />
  //     </div>
  //   </div>
  //   <div className={css.container_login_reg}>
  //     <button className={css.btn_login} type="submit">
  //       Login
  //     </button>
  //   </div>
  // </Form>
}
