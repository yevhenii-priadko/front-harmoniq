import css from './LoginPage.module.css';
import LoginForm from '@/components/LoginForm/LoginForm';

export default function LoginPage() {
  return (
    <section className={css.main_content}>
      <div className={css.form}>
        <h1 className={css.main_title}>Login</h1>

        <LoginForm />

        <p className={css.redirect_to_register}>
          Don’t have an account?{' '}
          <a className={css.register} href="/register">
            Register
          </a>
        </p>
      </div>
    </section>
  );
}
