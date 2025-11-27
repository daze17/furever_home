import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "ui";
import "ui/styles/globals.css";
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
        <NuqsAdapter>
          <main className="mt-[80px]">{children}</main>
        </NuqsAdapter>
        <Footer />
        <GlobalTransition />
        <Toaster />
      </body>
    </html>
  );
}
