import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "ui";

const VerifySuccessPage: React.Page = () => {
  return (
    <div className="flex min-h-[calc(100dvh-190px)] items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 animate-bounce text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Бүртгэл баталгаажлаа!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Таны бүртгэл амжилттай баталгаажлаа. Үргэлжлүүлэхийн тулд профайлаа үүсгэнэ үү.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/register/create-profile" passHref>
            <Button className="w-full">Профайл үүсгэх</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccessPage;
