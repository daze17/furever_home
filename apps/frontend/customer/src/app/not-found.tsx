import Image from "next/image";
import Link from "next/link";
import { cn } from "utils";

const NotFound: React.Page = () => {
  return (
    <div
      className={cn(
        "flex h-[calc(100dvh-190px)] flex-col items-center justify-center",
        // "bg-gradient-to-b from-pink-100 to-yellow-50",
      )}
    >
      <div className="p-8 text-center">
        <h1 className="mb-4 text-6xl font-bold text-orange-600">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Хуудас олдсонгүй
        </h2>
        <div className="mb-8">
          <Image
            src="/frenchie.jpg"
            alt="амьтан зураг"
            height={1000}
            width={1000}
            className="mx-auto h-64 w-64 rounded-lg shadow-lg"
          />
        </div>
        <Link
          href="/"
          className="rounded-lg bg-orange-400 px-6 py-3 text-white shadow-md transition hover:bg-orange-600"
        >
          Нүүр хуудас руу буцах
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
