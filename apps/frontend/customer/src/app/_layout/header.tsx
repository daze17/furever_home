// import { User } from "api/furever-home";
import { jwtDecode } from "jwt-decode";
import { CircleUserRound, Heart } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Button } from "ui/components/ui/button";

import { sessionName } from "@/utils/create_session";

import { MobileNav } from "./mobile_nav";
import { Navigation } from "./navigation";
import { ProfileSection } from "./profile_section";

export const Header: React.FC = () => {
  const appSession = cookies().get(sessionName);

  // const decodedToken = appSession
  //   ? jwtDecode<{ user: User }>(appSession?.value)
  //   : null;
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-[80px] items-center justify-between">
        <Image
          src="/logo.svg"
          alt="logo"
          width={40}
          height={40}
          className="py-4"
        />
        <Navigation />

        <div className="hidden sm:gap-1 md:flex">
          <Button variant="ghost" asChild>
            <Link
              href="/favorites"
              className="flex flex-col items-center text-xs"
            >
              <Heart size={24} className="flex-shrink-0" strokeWidth={1} />
              <span>Хадгалах</span>
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link href="/login" className="flex flex-col items-center text-xs">
              <CircleUserRound
                size={24}
                className="flex-shrink-0"
                strokeWidth={1}
              />
              <span>Нэвтрэх</span>
            </Link>
          </Button>
          {/* {decodedToken ? (
            <ProfileSection user={decodedToken.user} />
          ) : (
            <Button variant="ghost" asChild>
              <Link
                href="/login"
                className="flex flex-col items-center text-xs"
              >
                <CircleUserRound
                  size={24}
                  className="flex-shrink-0"
                  strokeWidth={1}
                />
                <span>Нэвтрэх</span>
              </Link>
            </Button>
          )} */}
        </div>
        <MobileNav />
      </div>
    </header>
  );
};
