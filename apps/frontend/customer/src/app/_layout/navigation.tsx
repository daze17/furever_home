"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "utils";

export const navLinks = [
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
  // {
  //   label: "Хандив",
  //   href: "/donation",
  // },
  {
    label: "Асуулт хариулт",
    href: "/faq",
  },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center md:block">
      <ul className="flex items-center gap-1">
        {navLinks.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <li key={index}>
              <Link
                href={link.href}
                className={cn(
                  "relative inline-block rounded-lg px-4 py-2 font-medium transition-all duration-200",
                  isActive
                    ? "text-orange-600"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
