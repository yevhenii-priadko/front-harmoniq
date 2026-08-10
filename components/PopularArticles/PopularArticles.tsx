// import Link from "next/link";
// import css from "./PopularArticles.module.css";
// //mport ArticlesItem from "@/components/ArticlesItem/ArticlesItem";

// async function getPopularArticles() {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/articles?sortBy=rate&sortOrder=desc&limit=6`,
//     { cache: "no-store" },
//   );
//   if (!res.ok) throw new Error("Failed to fetch articles");
//   const data = await res.json();
//   return data.articles;
// }

// export default async function PopularArticles() {
//   const articles = await getPopularArticles();
//   return (
//     <section id="popular" className={css.popular}>
//       <div className={css.heading}>
//         <h2 className={css.title}>Popular Articles</h2>
//         <Link className={css.link} href="/articles">
//           Go to all Articles
//         </Link>
//       </div>
//       <ul className={css.list}>
//         {articles.map((article) => (
//           <li key={article._id}>{/* <ArticlesItem article={article} /> */}</li>
//         ))}
//       </ul>
//     </section>
//   );
// }
