"use client";

import {
  Heart,
  Shield,
  TrendingUp,
  Users,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "ui";
import { cn } from "utils";

const Donation: React.FC<{
  accounts: {
    name: string;
    qr: string;
    account: string;
  }[];
}> = ({ accounts }) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = (account: string) => {
    navigator.clipboard.writeText(account);
    setCopiedAccount(account);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const impactStats = [
    {
      icon: Heart,
      value: "100%",
      label: "Хандив шууд зарцуулагдана",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: Shield,
      value: "500+",
      label: "Аврагдсан амьтад",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      value: "1,200+",
      label: "Амжилттай үрчлэлт",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="flex-1 space-y-8 rounded-2xl bg-white p-8 shadow-lg md:w-2/3">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-600">
          <Heart className="h-4 w-4" />
          <span>Хамтдаа амьтдыг аврацгаая</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
          GTN Mongolia
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
          Гэрийн тэжээвэр амьтдыг хамгаалах, нийгэмд эерэг, зөв ойлголт түгээх,
          гудамжинд зовсон амьтныг жаргалтай нийгэм бий болгох зорилгоор үйл
          ажиллагаа явуулж байна.
        </p>
      </div>

      {/* Impact Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {impactStats.map((stat, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 text-center shadow-sm transition-all hover:shadow-md"
          >
            <div
              className={cn(
                "mx-auto mb-4 inline-flex rounded-full p-3",
                stat.bgColor,
              )}
            >
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <div className="rounded-xl bg-gradient-to-br from-orange-50 to-pink-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Таны хандив юунд зарцуулагдах вэ?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Таны өгсөн{" "}
              <span className="font-bold text-orange-600">хандив зуун хувь</span>
              , зөвхөн зүдэрсэн амьтдыг аврах, эзэнтэй болгох, спэй засвар болон
              эмчилгээний зардалдаа зарцуулагдана.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="outline">
          <Link href="/about" className="flex items-center gap-2">
            Бидний тухай
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact" className="flex items-center gap-2">
            Бидэнтэй холбогдох
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">Хандив илгээх</span>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="space-y-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Дансны мэдээлэл</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              Илгээх газрын нэр:{" "}
              <span className="font-semibold text-gray-900">GTN Mongolia</span>
            </p>
            <p className="text-xs text-gray-500">
              Гүйлгээний утга: Өөрийн нэр эсвэл зорилтот хандивын нэр
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {accounts.map(({ name, qr, account }, idx) => (
            <div
              key={idx}
              className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              {/* QR Code */}
              <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={qr}
                  alt={`${name} QR`}
                  className="object-cover"
                  fill
                />
              </div>

              {/* Bank Name */}
              <p className="mb-2 text-center font-semibold text-gray-900">
                {name}
              </p>

              {/* Account Number with Copy */}
              <div className="relative">
                <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                  <span className="font-mono text-sm text-gray-700">
                    {account}
                  </span>
                  <button
                    onClick={() => copyToClipboard(account)}
                    className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
                    title="Хуулах"
                  >
                    {copiedAccount === account ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badge */}
      <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <Shield className="h-5 w-5 text-orange-600" />
          <span>
            Бүх хандив хяналттай, ил тод байдлаар амьтдын эрүүл мэндэд
            зарцуулагдана
          </span>
        </div>
      </div>
    </div>
  );
};
export default Donation;
