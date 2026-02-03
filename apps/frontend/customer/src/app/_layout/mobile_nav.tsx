"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import { CustomerProfileResponseBody } from "customer_api";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "ui";
import { cn } from "utils";

import { FavoritesButton } from "@/components/favorites_button";

import { navLinks } from "./navigation";
import { ProfileSection } from "./profile_section";

export const MobileNav: React.FC<{
  profile: CustomerProfileResponseBody | null;
}> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <div className="bg-white">
      <Button
        className="relative z-30 rounded-lg p-2 text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600 md:hidden"
        onClick={() => setIsOpen((cur) => !cur)}
        aria-label="Toggle menu"
        variant={"outline"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      <nav
        className={cn(
          "fixed left-0 top-[80px] z-40 flex h-0 w-full flex-col items-center justify-start overflow-hidden",
          isOpen && "h-[calc(100vh-80px)]",
        )}
      >
        <ul className="flex w-full flex-col gap-2 bg-white px-6">
          {navLinks.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <li key={index} className="w-full">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block w-full rounded-lg px-4 py-3 font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex h-36 w-full items-center justify-center bg-white">
          {profile ? (
            <div className="flex items-center gap-2">
              <FavoritesButton />
              <ProfileSection profile={profile} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant={"ghost"}
                onClick={() => setIsOpen(false)}
              >
                <Link href="/login" className="flex items-center gap-2">
                  <span className="font-medium">Нэвтрэх</span>
                </Link>
              </Button>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link href="/register" className="flex items-center gap-2">
                  <span className="font-medium">Бүртгүүлэх</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 top-[80px] z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
