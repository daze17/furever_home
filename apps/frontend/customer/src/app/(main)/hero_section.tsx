import { ArrowRight, Sparkles } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "ui";

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute -right-4 top-40 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-200/20 blur-3xl" />
      </div>

      <div className="relative flex min-h-[80vh] items-center">
        <div className="container mx-auto my-10 grid items-center gap-12 px-5 md:my-0 md:grid-cols-2 md:gap-20 md:px-8">
          {/* Text Content */}
          <div className="order-2 space-y-6 md:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-orange-600 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Амьтдад шинэ амьдрал бэлэглэцгээе</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
              Амьтанд хайртай{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                хэн бүхэнд
              </span>{" "}
              үргэлж нээлттэй
            </h1>

            {/* Description */}
            <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
              Амьтан үрчлэлт, гэмтсэн амьтдад туслах болон амьтан тэжээгчдийн
              холбоог өргөжүүлэхийн төлөө. Бид амьтан бүрт гэр бүл олж өгөхийг
              зорьж байна.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <Link href="#" className="flex items-center gap-2">
                  Амьтан үрчлэх
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="shadow-md transition-all hover:scale-105 hover:shadow-lg"
              >
                <Link href="#">Үрчлүүлэх</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            {/*<div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-pink-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  500+ баярлаг эзэд
                </span>
              </div>
              <div className="text-sm text-gray-600">
                ⭐ 4.9/5 (200+ үнэлгээ)
              </div>
            </div>*/}
          </div>

          {/* Image */}
          <div className="order-1 flex justify-center md:order-2">
            <div className="relative">
              {/* Decorative blob behind image */}
              <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-br from-orange-300/50 to-pink-300/50 blur-2xl" />

              <div className="relative overflow-hidden shadow-2xl">
                <Image
                  // src="/hero_dog.jpg"
                  src="/hero_dog.jpg"
                  alt="hero dog"
                  width={600}
                  height={600}
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white p-4 shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    1,200+
                  </div>
                  <div className="text-xs text-gray-600">Амьтан үрчлэгдсэн</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      {/*<div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full text-white/80"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="currentColor"
          />
        </svg>
      </div>*/}
    </div>
  );
};

export default HeroSection;
