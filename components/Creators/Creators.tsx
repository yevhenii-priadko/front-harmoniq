import Link from "next/link";
import css from "./Creators.module.css";
import Image from "next/image";

const creators = [
  { id: 1, name: "Naomi", avatar: "/img-homePage/Naomi.png" },
  { id: 2, name: "Andrii", avatar: "/img-homePage/Andrii.png" },
  { id: 3, name: "Emma", avatar: "/img-homePage/Emma.png" },
  { id: 4, name: "Max", avatar: "/img-homePage/Max.png" },
  { id: 5, name: "Tony", avatar: "/img-homePage/Tony.png" },
  { id: 6, name: "Tailor", avatar: "/img-homePage/Tailor.png" },
];

export default function Creators() {
  return (
    <section className={css.creators}>
      <div className={css.wrapper}>
        <h2 className={css.title}>Top Creators</h2>
        <div className={css.heading}>
          <Link className={css.link} href="/authors">
            Go to all Creators
          </Link>
          <svg width={24} height={24} className={css.icon}>
            <use href="/sprite.svg#icon-top-right" />
          </svg>
        </div>
        <ul className={css.list}>
          {creators.map((creator) => (
            <li className={css.listItem} key={creator.id}>
              <Image
                className={css.img}
                src={creator.avatar}
                alt={creator.name}
                width={148}
                height={148}
              />
              <p className={css.name}>{creator.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
