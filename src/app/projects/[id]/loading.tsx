import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-2 flex h-screen flex-wrap gap-4 py-16">
      <div className="relative w-full max-w-xl sm:flex-1">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-300" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} disabled>
                <span className="h-4 w-24 animate-pulse rounded bg-gray-300" />
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Array.from({ length: 3 }).map((_, index) => (
                <DropdownMenuItem
                  key={index}
                  className="flex items-center gap-2"
                >
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row gap-4 py-4">
          <div className="h-4 w-60 animate-pulse rounded bg-gray-300" />
        </div>
        <div className="gap-4 py-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-full xl:flex-1">
              <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-300" />
              <Card className="m-0 w-full pt-6">
                <CardContent>
                  <div className="h-40 w-full animate-pulse rounded bg-gray-300" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* project members */}
        <div className="gap-4 py-4">
          <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-300" />
          <div className="flex flex-row flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-2 py-1">
                <Avatar>
                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
                  <AvatarFallback className="animate-pulse bg-gray-300" />
                </Avatar>
                <div className="flex flex-col">
                  <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-300" />
                  <Badge className="h-3 w-16 animate-pulse rounded bg-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full max-w-xl">
      </div>
    </div>
  );
}
