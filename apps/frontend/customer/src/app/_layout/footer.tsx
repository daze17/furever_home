"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  PawPrint,
  Heart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "ui";
import { cn } from "utils";

import { navLinks } from "./navigation";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const quickLinks = [
    { label: "Бидний тухай", href: "/about" },
    { label: "Холбоо барих", href: "/contact" },
    { label: "Нууцлалын бодлого", href: "/privacy" },
    { label: "Үйлчилгээний нөхцөл", href: "/terms" },
  ];

  const resources = [
    { label: "Амьтан асрах заавар", href: "/guides" },
    { label: "Түгээмэл асуултууд", href: "/faq" },
    { label: "Сайн дурын ажил", href: "/volunteer" },
    { label: "Хандив өгөх", href: "/donation" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Section - Only on Homepage */}
      {isHomePage && (
        <div className="border-b border-gray-800">
          <div className="container mx-auto px-5 py-16">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
                  <Heart className="h-4 w-4" />
                  <span>Шинэ эзэнтэй болгоорой</span>
                </div>
                <h2 className="text-4xl font-bold text-white md:text-5xl">
                  Өөрийн хайртай амьтанаа үрчлүүлэх
                </h2>
                <p className="text-lg leading-relaxed text-gray-400">
                  Та өөрийн хайртай амьтанаа үрчлүүлэх, шинэ эзэн олж өгөх
                  шаардлагатай болсон уу? Бид танд хамгийн хялбар, найдвартай
                  арга замыг олж өгж туслах болно.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="group bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Link href="/adoption" className="flex items-center gap-2">
                    Үрчлүүлэх
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center md:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 blur-3xl" />
                  <div className="flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-2xl">
                    <PawPrint className="h-32 w-32 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-5 py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="space-y-6 lg:col-span-1">
              <Link href="/" className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-orange-500 to-pink-500 p-3">
                  <PawPrint className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Furever Home
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-400">
                Амьтан үрчлэлт, гэмтсэн амьтдад туслах болон амьтан тэжээгчдийн
                холбоог өргөжүүлэхийн төлөө.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                <Link
                  href="https://facebook.com/furever"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gray-800 p-2.5 text-gray-400 transition-all hover:bg-orange-500 hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="https://instagram.com/furever"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gray-800 p-2.5 text-gray-400 transition-all hover:bg-orange-500 hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://x.com/furever"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gray-800 p-2.5 text-gray-400 transition-all hover:bg-orange-500 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Цэс</h3>
              <ul className="space-y-3">
                {navLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 transition-colors hover:text-orange-400"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">
                Хурдан холбоос
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 transition-colors hover:text-orange-400"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Холбоо барих</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-orange-400" />
                  <span className="text-sm text-gray-400">
                    Улаанбаатар, Монгол Улс
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-orange-400" />
                  <a
                    href="tel:+97699999999"
                    className="text-sm text-gray-400 transition-colors hover:text-orange-400"
                  >
                    +976 9999-9999
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 flex-shrink-0 text-orange-400" />
                  <a
                    href="mailto:info@fureverhome.mn"
                    className="text-sm text-gray-400 transition-colors hover:text-orange-400"
                  >
                    info@fureverhome.mn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950">
        <div className="container mx-auto px-5 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Furever Home. Бүх эрх хуулиар
              хамгаалагдсан.
            </p>
            <p className="text-center text-xs text-gray-600">
              Powered by Global Trust Networks Mongolia Co., Ltd.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
