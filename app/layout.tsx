import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import NavBar from "@/app/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manga Site",
  description: "Read manga online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
          style={{backgroundImage: "url(https://img.freepik.com/free-vector/blurred-abstract-background-design_1107-169.jpg)"}}
          className={inter.className + " min-h-screen bg-fixed relative bg-cover bg-no-repeat bg-center " +
              "before:bg-black/65 before:content-[''] before:h-full before:w-full before:block before:t-0 before:l-0 before:absolute"
      }>
        <Providers>
          <NavBar/>
          <main
              className="w-full max-w-[1024px] mx-auto mt-3"
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
