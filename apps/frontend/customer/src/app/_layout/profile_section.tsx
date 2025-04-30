"use client";

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

export const ProfileSection: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(setIsOpenAtom);
  // const firstLetters = user?.firstName.charAt(0) + user?.lastName.charAt(0);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="border">
            {/* <AvatarImage src={user.profileImage} /> */}
            {/* <AvatarFallback>{firstLetters}</AvatarFallback> */}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/profile">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem>Settings</DropdownMenuItem>
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
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutDialog />
    </div>
  );
};
