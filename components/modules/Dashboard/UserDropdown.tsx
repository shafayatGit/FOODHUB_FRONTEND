"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserInfo } from "@/types/user.types";
import { logoutAction } from "@/services/auth.services";
import { Key, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

interface UserDropdownProps {
  userInfo: UserInfo;
}

const getProfilePath = (role: string) => {
  switch (role?.toUpperCase()) {
    case "PROVIDER":
      return "/my-profile";
    case "ADMIN":
      return "/my-profile";
    default:
      return "/my-profile";
  }
};

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const [isPending, startTransition] = useTransition();
  const profilePath = getProfilePath(userInfo.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="rounded-full">
          <Avatar className="size-8">
            {userInfo.image && (
              <AvatarImage src={userInfo.image} alt={userInfo.name} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {userInfo.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={"end"} className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userInfo.name}</p>

            <p className="text-xs text-muted-foreground">{userInfo.email}</p>

            <p className="text-xs text-primary capitalize">
              {userInfo.role.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link className="flex items-center" href={profilePath}>
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isPending}
          onClick={() => startTransition(() => logoutAction())}
          className="cursor-pointer text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
