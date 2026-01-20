import { CustomerProfileResponseBody } from "customer_api";
import { useAtom } from "jotai";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "ui";

import { LogoutDialog, setIsOpenAtom } from "./logout_dialog";

export const ProfileSection: React.FC<{
  profile: CustomerProfileResponseBody;
}> = ({ profile }) => {
  const [isOpen, setIsOpen] = useAtom(setIsOpenAtom);
  const firstLetters =
    profile?.first_name.charAt(0) + profile?.last_name.charAt(0);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="border">
            <AvatarImage src={profile.profile_image_url || ""} />
            <AvatarFallback>{firstLetters}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Миний бүртгэл</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/profile">
              <DropdownMenuItem>Профайл</DropdownMenuItem>
            </Link>
            <Link href="/my_pets">
              <DropdownMenuItem>Миний тэжээвэр амьтад</DropdownMenuItem>
            </Link>
            <Link href="/adoptions">
              <DropdownMenuItem>Миний үрчлүүлэх зарууд</DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem>Тохиргоо</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              type="button"
              variant="secondary"
              className="w-full bg-gray-200"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Гарах
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutDialog />
    </div>
  );
};
