import { CircleUserRound, Heart, PawPrint } from "lucide-react";

import { cookies } from "next/headers";
import Link from "next/link";

import { Button } from "ui/components/ui/button";

import { accessTokenName } from "@/utils/create_tokens";

import { MobileNav } from "./mobile_nav";
import { Navigation } from "./navigation";
import { ProfileSection } from "./profile_section";

export const Header = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(accessTokenName)?.value;
  const isAuthenticated = !!accessToken;
  console.log(isAuthenticated, "isAuthenticatedisAuthenticated");

  return (
    <header className="fixed top-0 z-50 w-full border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="container mx-auto flex h-[80px] items-center justify-between px-5">
        {/* Logo */}
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

        {/* Desktop Navigation */}
        <Navigation />

        {/* Right Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/favorites" className="flex items-center gap-2">
              <Heart size={20} strokeWidth={2} />
              <span className="font-medium">Хадгалах</span>
            </Link>
          </Button>

          {isAuthenticated ? (
            <ProfileSection />
          ) : (
            <Button asChild>
              <Link href="/login" className="flex items-center gap-2">
                <CircleUserRound size={20} strokeWidth={2} />
                <span className="font-medium">Нэвтрэх</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileNav />
      </div>
    </header>
  );
};
