"use client";

import { CircleUserRound, Heart, Menu, X } from "lucide-react";
import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "ui";
import { cn } from "utils";

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const navItems = [
    {
      label: "Нүүр",
      href: "/",
    },
    {
      label: "Амьтдын төрөл",
      href: "/pets",
    },
    {
      label: "Үрчлүүлэх",
      href: "/adoption",
    },
    {
      label: "Хандив",
      href: "/donation",
    },
    {
      label: "Асуулт хариулт",
      href: "/faq",
    },
  ];

  return (
    <>
      <button
        className="relative z-30 rounded-lg p-2 text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600 md:hidden"
        onClick={() => setIsOpen((cur) => !cur)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav
        className={cn(
          "fixed left-0 top-[80px] z-40 flex h-0 w-full flex-col items-center justify-start overflow-hidden",
          isOpen && "h-[calc(100vh-80px)]",
        )}
      >
        <ul className="flex w-full flex-col gap-2 px-6">
          {navItems.map((item, index) => {
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

        <div className="mt-8 flex w-full flex-col gap-3 px-6">
          <Button asChild className="w-full">
            <Link
              className="flex items-center justify-center gap-2"
              href="/login"
              onClick={() => setIsOpen(false)}
            >
              <CircleUserRound className="size-5" />
              Нэвтрэх
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link
              className="flex items-center justify-center gap-2"
              href="/favorites"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="size-5" />
              Таалагдсан
            </Link>
          </Button>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 top-[80px] z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
