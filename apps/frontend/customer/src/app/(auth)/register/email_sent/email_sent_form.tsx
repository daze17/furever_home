"use client";

import { ArrowLeft, MailIcon } from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  toast,
} from "ui";

import { client } from "@/services/client";
import { setLastResendTimestamp } from "../actions";

const COOLDOWN_SECONDS = 60;

interface Props {
  email: string;
  initialCountdown: number;
}

export const EmailSentForm: React.FC<Props> = ({ email, initialCountdown }) => {
  const [isPending, setIsPending] = useState(false);
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Алдаа", {
        description: "Имэйл хаяг олдсонгүй. Дахин бүртгүүлнэ үү.",
      });
      return;
    }

    try {
      setIsPending(true);
      const response = await client.auth.registerCredentials({
        body: {
          email: email,
        },
      });

      switch (response.status) {
        case 201:
          toast.success("Амжилттай", {
            description: "Баталгаажуулах имэйл амжилттай дахин илгээгдлээ.",
          });
          // Set the cooldown timer
          await setLastResendTimestamp(Date.now());
          setCountdown(COOLDOWN_SECONDS);
          break;
        case 400:
          toast.error("Алдаа", {
            description: "Баталгаажуулах имэйл илгээхэд алдаа гарлаа.",
            // variant: "destructive",
          });
          break;
        case 429:
          // Backend enforced rate limit
          const retryAfter = response.body.retry_after;
          await setLastResendTimestamp(
            Date.now() - (COOLDOWN_SECONDS - retryAfter) * 1000,
          );
          setCountdown(retryAfter);
          toast.error("Хэт олон хүсэлт", {
            description: `${retryAfter} секунд хүлээнэ үү.`,
          });
          break;
        default:
          toast.error("Алдаа", {
            description: "Тодорхойгүй алдаа гарлаа.",
          });
      }
    } catch (error) {
      toast.error("Алдаа", {
        description: "Баталгаажуулах имэйл илгээхэд алдаа гарлаа.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const isResendDisabled = isPending || countdown > 0;

  return (
    <div className="flex h-[calc(100dvh-190px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <MailIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <CardTitle className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Имэйлээ шалгана уу
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600">
            Бид таны{" "}
            <span className="font-semibold">{email || "имэйл хаяг руу"}</span>{" "}
            баталгаажуулах холбоос илгээлээ. Бүртгэлээ баталгаажуулахын тулд
            холбоос дээр дарна уу.
          </p>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Имэйл ирээгүй юу? Спам хавтсаа шалгаад дахин илгээлгэнэ үү.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            onClick={handleResendEmail}
            disabled={isResendDisabled}
          >
            {isPending
              ? "Илгээж байна..."
              : countdown > 0
                ? `${countdown} секундын дараа дахин илгээх`
                : "Баталгаажуулах имэйл дахин илгээх"}
          </Button>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Нэвтрэх хуудас руу буцах
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
