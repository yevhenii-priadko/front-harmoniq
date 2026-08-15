import { ReactNode } from "react";
import css from "./SectionTitle.module.css";

type SectionTitleProps = {
  children: ReactNode;
};

export default function SectionTitle({ children }: SectionTitleProps) {
  return <h1 className={css.title}>{children}</h1>;
}
