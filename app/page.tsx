import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
//import PopularArticles from "@/components/PopularArticles/PopularArticles";
import Creators from "@/components/Creators/Creators";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      {/* <PopularArticles /> */}
      <Creators />
    </main>
  );
}
