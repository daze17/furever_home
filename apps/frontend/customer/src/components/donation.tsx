import { Dog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "ui";
import { cn } from "utils";

const Donation: React.FC<{
  accounts: {
    name: string;
    qr: string;
    account: string;
  }[];
}> = ({ accounts }) => {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md md:w-2/3">
      <h1 className="text-center text-3xl font-bold md:text-5xl">
        GTN Mongolia
      </h1>
      <p className="mt-6 leading-relaxed text-gray-700">
        GTN Mongolia нь гэрийн тэжээвэр амьтдыг хамгаалах, нийгэмд эерэг, зөв
        ойлголт түгээх, гудамжинд зовсон амьтныг жаргалтай нийгэм бий болгох
        зорилгоор үйл ажиллагаа явуулж байна.
      </p>
      <p className="mt-4 leading-relaxed text-gray-700">
        Таны өгсөн{" "}
        <span className="font-bold text-red-600">хандив зуун хувь</span>, зөвхөн
        зүдэрсэн амьтдыг аврах, эзэнтэй болгох, спэй засвар болон эмчилгээний
        зардалдаа зарцуулагдана.
      </p>
      <p className="mt-6 text-center text-gray-700">
        Та бүхэн бидэнд хандив өгч амьтан аврах, хамгаалах үйлсэд нэгдээрэй{" "}
        <Dog className="inline-block" />
      </p>
      <div
        className={cn("mt-6 flex flex-col justify-center gap-4", "md:flex-row")}
      >
        <Button
          asChild
          className="rounded-lg bg-red-100 px-6 py-2 text-red-600 shadow hover:bg-red-200"
        >
          <Link href="#">Бидний тухай</Link>
        </Button>
        <Button
          asChild
          className="rounded-lg bg-blue-100 px-6 py-2 text-blue-600 shadow hover:bg-blue-200"
        >
          <Link href="#">Бидэнтэй холбогдох</Link>
        </Button>
      </div>

      <div className="mt-10 rounded-lg bg-blue-100 p-5">
        <h2 className="text-lg font-semibold text-blue-800">Хандив илгээх</h2>
        <p className="mt-2 text-sm text-gray-700">
          Илгээх газрын нэр: <span className="font-semibold">GTN Mongolia</span>
        </p>
        <p className="text-sm text-gray-700">
          Гүйлгээний утга: Өөрийн нэр эсвэл зорилтот хандивын нэр
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {accounts.map(({ name, qr, account }, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <Image
                src={qr}
                alt={`${name} QR`}
                className="rounded-md object-contain"
                width={100}
                height={100}
              />
              <p className="mt-2 text-sm font-semibold text-gray-800">{name}</p>
              <p className="text-gray-600">{account}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa nesciunt
        qui, neque vero architecto libero repudiandae facilis fugit.
      </p>
    </div>
  );
};
export default Donation;
