import { Heart, Home as HomeIcon, Users, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "ui";
import { cn } from "utils";

import Donation from "@/components/donation";
import Event from "@/components/event";
import { serverErrorMap } from "@/components/server_error";

// import AnimalsNeededSupportCarousel from "./animal_support_list_carousel";
import HeroSection from "./hero_section";
// import HomePetList from "./home_pet_list";

const accounts = [
  {
    name: "Хаан банк",
    qr: "/qr.png",
    account: "5003 853 278",
  },
  {
    name: "Хас банк",
    qr: "/qr.png",
    account: "5003 853 278",
  },
  {
    name: "XXБанк",
    qr: "/qr.png",
    account: "5003 853 278",
  },
];

const features = [
  {
    icon: Heart,
    title: "Хайраар дүүрэн",
    description:
      "Бид амьтдыг хайрлаж, тэдний сайн сайхан амьдралыг хангахад тусалдаг",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: HomeIcon,
    title: "Өөрийн гэр",
    description:
      "Амьтан бүр өөрийн гэсэн гэр, өрөвч, эзэнтэй болохыг хүсдэг",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Users,
    title: "Нийгэмлэг",
    description:
      "Амьтан үрчлэгчид болон тэжээгчдийн нэгдсэн нийгэмлэгт нэгдээрэй",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Shield,
    title: "Найдвартай",
    description:
      "Бүх амьтад эрүүл мэндийн үзлэг, вакцинжуулалтаар хангагдсан байдаг",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

const stats = [
  { number: "1,200+", label: "Амьтан үрчлэгдсэн" },
  { number: "500+", label: "Баярлаг гэр бүл" },
  { number: "50+", label: "Сайн дурын ажилтан" },
  { number: "100%", label: "Хайр энэрэл" },
];

export const revalidate = 0;
const Home: React.Page = async () => {
  // const response = await client.pet.getPets({ query: {} });

  // if (response.status !== 200) {
  //   return serverErrorMap(response);
  // }

  return (
    <div className="bg-gradient-to-b from-orange-50 via-white to-[#fbfbfb]">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="border-y border-orange-100 bg-white/50 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-orange-600">
                  {stat.number}
                </div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
              Бид юу хийдэг вэ?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Амьтан үрчлэлтийг илүү хялбар, аюулгүй болгох
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={cn(
                    "inline-flex rounded-xl p-3",
                    feature.bgColor,
                    "transition-transform duration-300 group-hover:scale-110",
                  )}
                >
                  <feature.icon className={cn("h-8 w-8", feature.color)} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-16">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Хайртай амьтантай болоорой
          </h2>
          <p className="mt-4 text-xl text-orange-50">
            Өнөөдөр амьтан үрчлэн авч, тэдний амьдралыг өөрчлөөрэй
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Link href="#">Амьтан хайх</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="#">Амьтан үрчлүүлэх</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Donation & Event Section */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className={cn("flex flex-col gap-10", "lg:flex-row")}>
            <Donation accounts={accounts} />
            <Event />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-orange-50 py-16">
        <div className="container mx-auto px-5">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
              Амжилттай үрчлэгчид
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Манай амьтдыг үрчлэн авсан хүмүүсийн сэтгэгдэл
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 italic text-gray-700">
                  "Бид Maxыг үрчлэн авснаас хойш манай гэр бүл илүү аз жаргалтай
                  болсон. GTN Mongolia-д баярлалаа!"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Сарантуяа Б.
                    </div>
                    <div className="text-sm text-gray-500">
                      Maxын эзэн - 2024
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Манай нийгэмлэгт нэгдэхэд бэлэн үү?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Амьтан үрчлэх, сайн дурын ажилтан болох эсвэл хандив өгөх
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#">Эхлүүлэх</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#">Дэлгэрэнгүй</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
