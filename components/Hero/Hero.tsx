import Link from "next/link";
import css from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={css.hero}>
      <div className={css.wrapper}>
        <div className={css.img}></div>
        <h1 className={css.mainTitle}>
          Find your <span className={css.span}>harmony</span> in community
        </h1>
        <ul className={css.btns}>
          <li>
            <Link className={css.btn} href="#popular">
              Go to Articles
            </Link>
          </li>
          <li>
            <Link className={css.regBtn} href="/auth/register">
              Register
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
