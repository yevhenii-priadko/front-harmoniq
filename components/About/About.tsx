import css from "./About.module.css";
import Image from "next/image";

export default function About() {
  return (
    <section className={css.about}>
      <div className={css.wrapper}>
        <ul className={css.list}>
          <li className={css.description}>
            <h2 className={css.title}>About us</h2>
            <p className={css.prgf}>
              Harmoniq is a mindful publishing platform dedicated to mental health and
              well-being. We bring together writers, thinkers, and readers who believe
              that open, thoughtful stories can heal, inspire, and connect. Whether
              you&apos;re here to share your journey or learn from others — this is your
              space to slow down, reflect, and grow.
            </p>
          </li>
          <li className={css.img}>
            <Image
              className={css.mobileImg}
              src="/img-homePage/mob-lotus@2x.webp"
              width={361}
              height={365}
              alt="Lotus picture"
            />
            <Image
              className={css.tabletImg}
              src="/img-homePage/tab-lotus@2x.webp"
              width={249}
              height={326}
              alt="Lotus picture"
            />
            <Image
              className={css.deskImg}
              src="/img-homePage/desk-lotus@2x.webp"
              width={704}
              height={326}
              alt="Lotus picture"
            />
          </li>
          <li className={css.img}>
            <Image
              className={css.mobileImg}
              src="/img-homePage/mob-friends@2x.webp"
              width={361}
              height={365}
              alt="Friends picture"
            />
            <Image
              className={css.tabletImg}
              src="/img-homePage/tab-friends@2x.webp"
              width={704}
              height={398}
              alt="Lotus picture"
            />
            <Image
              className={css.deskImg}
              src="/img-homePage/desk-friends@2x.webp"
              width={808}
              height={398}
              alt="Lotus picture"
            />
          </li>
          <li className={css.deskImg}>
            <Image
              className={css.deskImg}
              src="/img-homePage/meditation@2x.webp"
              width={392}
              height={398}
              alt="Woman is relaxing"
            />
          </li>
        </ul>
      </div>
    </section>
  );
}
