"use client";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { LockKeyhole, LockKeyholeOpen, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import SiemensLogo from "../../public/siemens-logo.png";
import Authenticate from "./authenticate";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";

export default function Header({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 bg-white px-4 shadow-sm md:px-6 md:py-10">
      <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          {session ? (
            <LockKeyholeOpen className="h-8 w-8 text-muted-foreground" />
          ) : (
            <LockKeyhole className="h-8 w-8 text-muted-foreground" />
          )}
        </Link>

        {/* Drop-down menu for Project */}
        <DropdownMenu open={isHovered}>
          <DropdownMenuTrigger asChild>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <Link
                href="/projects"
                className={cn(
                  pathname.startsWith("/projects")
                    ? "text-foreground"
                    : "text-muted-foreground",
                  "text-lg font-medium transition-colors hover:text-foreground",
                )}
              >
                Projects
              </Link>
              <DropdownMenuContent
                align="start"
                side="bottom"
                className="absolute mt-2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuItem asChild>
                  <Link href="/assess">Assess</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/results">Results</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>

        <Link
          prefetch
          href="/refa"
          className={cn(
            pathname.startsWith("/refa")
              ? "text-foreground"
              : "text-muted-foreground",
            "min-w-fit text-lg font-medium transition-colors hover:text-foreground",
          )}
        >
          Reference Model
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="mr-12 flex w-44 items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Image
                src={SiemensLogo}
                height={500}
                width={500}
                alt="Siemens Logo"
              />
              <span className="sr-only">Siemens</span>
            </Link>
            <Link href="/projects" className="hover:text-foreground">
              Projects
            </Link>
            <Link
              prefetch
              href="/refa"
              className="text-muted-foreground hover:text-foreground"
            >
              Reference Model
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full justify-end">
        {!session && <Authenticate action="signIn" />}
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="image" className="rounded-full">
                {session?.user?.image && (
                  <img
                    src={session?.user?.image}
                    alt="User profile"
                    className="rounded-full"
                  />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Authenticate className="bg-none" action="signOut" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
