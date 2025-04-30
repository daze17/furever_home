"use client";
import { CircleUserRound, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "ui";
import { cn } from "utils";

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        className="absolute right-8 top-1/2 z-30 -translate-y-1/2 md:hidden"
        onClick={() => setIsOpen((cur) => !cur)}
      >
        <Image src="/menu.svg" alt="Burger menu icon" width={32} height={32} />
      </button>
      <nav
        className={cn(
          "fixed top-0 z-10 flex h-0 w-full flex-col items-center justify-center space-y-6 overflow-hidden bg-white/20 backdrop-blur-lg transition-all",
          isOpen && "h-screen",
        )}
        onClick={() => setIsOpen(false)}
      >
        <ul className="flex flex-col gap-4">
          {navItems.map((item, index) => (
            <li key={index} className="w-full border-b border-gray-400 pb-2">
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link className="flex items-center gap-2" href="/login">
              <CircleUserRound className="size-6" />
              Нэвтрэх
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link className="flex items-center gap-2" href="/favorite">
              <Heart className="size-6" />
              Таалагдсан
            </Link>
          </Button>
        </div>
      </nav>
    </>
  );
};
