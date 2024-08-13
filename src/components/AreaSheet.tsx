"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Area, Artefact } from "@prisma/client";

export function AreaSheet({
  area,
  children,
}: Readonly<{
  area: Area & { artefacts: Artefact[] };
  children: React.ReactNode;
}>) {
  return (
    <Sheet key={area.area_id}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="lg:min-w-[40vw]">
        <SheetHeader>
          <SheetTitle className="text-center">
            <div>Area Details: </div>
            {area.area_name}
          </SheetTitle>
          <SheetDescription className="text-left">
            <div className="my-4 flex">
              <SheetTitle>People</SheetTitle>
              <Badge
                variant={
                  area.people === "High"
                    ? "destructive"
                    : area.technology === "Medium"
                      ? "secondary"
                      : "default"
                }
                className="ml-2"
              >
                {area.people}
              </Badge>
            </div>
            <ul>
              {area.people_practices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="my-4 flex">
              <SheetTitle>Process</SheetTitle>
              <Badge
                variant={
                  area.process === "High"
                    ? "destructive"
                    : area.technology === "Medium"
                      ? "secondary"
                      : "default"
                }
                className="ml-2"
              >
                {area.process}
              </Badge>
            </div>
            <ul>
              {area.process_practices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="my-4 flex">
              <SheetTitle>Technology</SheetTitle>
              <Badge
                variant={
                  area.technology === "High"
                    ? "destructive"
                    : area.technology === "Medium"
                      ? "secondary"
                      : "default"
                }
                className="ml-2"
              >
                {area.technology}
              </Badge>
            </div>
            <ul>
              {area.technology_practices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
