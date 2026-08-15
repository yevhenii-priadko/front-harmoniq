import { Manrope, Merienda } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "@/styles/globals.css";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import AuthSessionChecker from "@/components/AuthSessionChecker/AuthSessionChecker";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const merienda = Merienda({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-merienda",
});

export const metadata = {
  title: "Harmoniq",
  description: "Find your harmony in community",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uk"
      className={`${manrope.variable} ${merienda.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <AuthSessionChecker />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
