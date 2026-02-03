"use client";

import { PawPrint } from "lucide-react";
import { use } from "react";

import Link from "next/link";

import { Button } from "ui";

import { FavoritesButton } from "@/components/favorites_button";
import { useSession } from "@/contexts/auth";

import { MobileNav } from "./mobile_nav";
import { Navigation } from "./navigation";
import { ProfileSection } from "./profile_section";

export const Header = () => {
  const { sessionPromise } = useSession();
  const session = use(sessionPromise);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/95">
      <div className="container mx-auto flex h-[80px] w-full items-center justify-between px-5">
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="rounded-full bg-gradient-to-br from-orange-500 to-pink-500 p-2">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <span className="hidden text-xl font-bold text-gray-900 sm:block">
            Furever Home
          </span>
        </Link>

        <Navigation />

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {session ? (
              <div className="flex items-center gap-2">
                <FavoritesButton />
                <ProfileSection profile={session} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant={"ghost"}>
                  <Link href="/login" className="flex items-center gap-2">
                    <span className="font-medium">Нэвтрэх</span>
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" className="flex items-center gap-2">
                    <span className="font-medium">Бүртгүүлэх</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
          <MobileNav profile={session} />
        </div>
      </div>
    </header>
  );
};
