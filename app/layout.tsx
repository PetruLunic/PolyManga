import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import NavbarRoot from "@/app/_components/navbar/NavbarRoot";
import {SessionProviderProps} from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manga Site",
  description: "Read manga online",
};

interface Props {
  children: React.ReactNode;
  params: {
    session: SessionProviderProps["session"]
  }
}

export default function RootLayout({children, params: {session}}: Props) {
  return (
    <html lang="en" className="dark">
    <body
        className={inter.className + " before:bg-[url('https://img.freepik.com/free-vector/blurred-abstract-background-design_1107-169.jpg')]" +
            " bg-black/50 min-h-screen before:bg-fixed before:bg-cover before:bg-no-repeat before:bg-center " +
            "before:bg-black/50 before:content-[''] before:h-full before:w-full before:block before:t-0 before:l-0 before:fixed before:z-[-1]"
        }>
    <Providers session={session}>
      <NavbarRoot/>
      <div className="z-40 w-full h-auto sticky top-0 inset-x-0" id="navbar-portal"></div>
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
