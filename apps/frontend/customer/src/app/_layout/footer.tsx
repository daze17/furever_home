"use client";

import { Facebook, Instagram, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "ui";
import { cn } from "utils";

import { navLinks } from "./navigation";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <div>
      <footer
        className={cn(
          "container mx-auto rounded-3xl",
          isHomePage && "bg-[#f4d1ed] p-5",
        )}
      >
        {isHomePage && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="my-12 p-5">
              <h1 className="my-4 text-5xl font-bold">
                Өөрийн хайртай амьтанаа үрчлүүлэх
              </h1>
              <p>
                Та өөрийн хайртай амьтанаа үрчлүүлэх, шинэ эзэн олж өгөх
                шаардлагатай болсон уу? Бид танд хамгийн хялбар, найдвартай арга
                замыг олж өгж туслах болно.
              </p>
            </div>
            <div className="flex items-center p-5 md:justify-end">
              {/* TODO: ADD ILLUSTRATION */}
              <Button
                variant={"outline"}
                className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white text-xl uppercase"
              >
                үрчлүүлэх
              </Button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between rounded-3xl bg-black px-5 text-white">
          <Image src="/logo.svg" width={64} height={64} alt="Logo" />
          <ul
            className={cn(
              "flex flex-col flex-wrap items-center justify-center space-y-3",
              "md:flex-row md:flex-nowrap md:space-y-0",
            )}
          >
            {navLinks.map((item, index) => (
              <li key={index} className="px-3">
                <Link className="hover:text-gray-500" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Link
              href="https://facebook.com/furever"
              target="_blank"
              className="hover:text-gray-500"
            >
              <Facebook strokeWidth={1} />
            </Link>
            <Link
              href="https://instagram.com/furever"
              target="_blank"
              className="hover:text-gray-500"
            >
              <Instagram strokeWidth={1} />
            </Link>
            <Link
              href="https://x.com/furever"
              target="_blank"
              className="hover:text-gray-500"
            >
              <TwitterIcon strokeWidth={1} />
            </Link>
          </div>
        </div>
      </footer>
      <p className="my-2 text-center text-sm text-gray-600">
        Copyright(C) Global Trust Networks Mongolia Co.,Ltd. All Rights
        Reserved.
      </p>
    </div>
  );
};
