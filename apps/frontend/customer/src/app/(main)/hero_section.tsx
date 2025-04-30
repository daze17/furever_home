import Image from "next/image";
import { Button } from "ui";

const HeroSection: React.FC = () => {
  return (
    <div className="flex items-center md:h-[65vh]">
      <div className="container mx-auto my-10 grid items-center gap-20 px-5 md:my-0 md:grid-cols-2 md:px-0">
        <div className="order-2 md:order-1">
          <h1 className="text-5xl font-bold uppercase">
            {"Амьтанд хайртай хэн бүхэнд үргэлж нээлттэй"}
          </h1>
          <p className="text-gray">
            {
              "Амьтан үрчлэлт, гэмтсэн амьтдад туслах болон амьтан тэжээгчдийн холбоог өргөжүүлэхийн төлөө"
            }
          </p>
          <div className="mt-10 flex gap-4">
            <Button>{"Амьтан үрчлэх"}</Button>
            <Button variant={"outline"}>{"Үрчлүүлэх"}</Button>
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <Image
            src={"/hero_dog.jpg"}
            width={500}
            height={500}
            alt="hero dog"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
