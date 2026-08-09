'use client';
import css from './LoginPage.module.css';
import { Formik, Form, Field } from 'formik';

export default function LoginPage() {
  return (
    <main className={css.main_content}>
      <Formik initialValues={{}} onSubmit={() => {}}>
        <Form className={css.form}>
          <h1 className={css.main_title}>Login</h1>
          <div className={css.main_container_form}>
            <div className={css.container_form}>
              <label className={css.label_form} htmlFor="email">
                Enter your email address
              </label>
              <Field
                id="email"
                type="email"
                name="email"
                className={css.field_from}
                placeholder="email@gmail.com"
                required
              />
            </div>
            <div className={css.container_form}>
              <label className={css.label_form} htmlFor="password">
                Enter a password
              </label>
              <Field
                id="password"
                type="password"
                name="password"
                className={css.field_from}
                required
              />
            </div>
          </div>
          <div className={css.container_login_reg}>
            <button className={css.btn_login} type="submit">
              Login
            </button>
            <p className={css.redirect_to_register}>
              Don’t have an account?{' '}
              <a className={css.register} href="#">
                Register
              </a>
            </p>
          </div>
        </Form>
      </Formik>
    </main>
  );
}
