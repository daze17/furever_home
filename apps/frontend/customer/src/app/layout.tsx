import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "ui";
import "ui/globals.css";
import { cn } from "utils";

import { GlobalTransition } from "@/components/global_transition";
import { UserSessionProvider } from "@/contexts/auth";
import { FavoritesCountProvider } from "@/contexts/favorites_count";
import { verifySession } from "@/utils/dal";
import { getFavoritesCount } from "@/hooks/use_get_favorites_count";

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
  const sessionPromise = verifySession();
  const favoritesCountPromise = getFavoritesCount();

  return (
    <html lang="en">
      <UserSessionProvider sessionPromise={sessionPromise}>
        <FavoritesCountProvider favoritesCountPromise={favoritesCountPromise}>
          <body className={cn(nunito.className)}>
            <Header />
            <NuqsAdapter>
              <main className="mt-[80px]">{children}</main>
            </NuqsAdapter>
            <Footer />
            <GlobalTransition />
            <Toaster />
          </body>
        </FavoritesCountProvider>
      </UserSessionProvider>
    </html>
  );
}
