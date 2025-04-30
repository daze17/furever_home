import "ui/styles/globals.css";

import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { cn } from "utils";

import { GlobalTransition } from "@/components/global_transition";

import { Footer } from "./_layout/footer";
import { Header } from "./_layout/header";

const nunito = Nunito({
  subsets: ["cyrillic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Furever Home",
    default: "Furever Home",
  },
  description: "Furever Home хамгийн сайн найзаа олоход тусална",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(nunito.className)}>
        <Header />
        <main className="mt-[80px]">{children}</main>
        <Footer />
        <GlobalTransition />
      </body>
    </html>
  );
}
