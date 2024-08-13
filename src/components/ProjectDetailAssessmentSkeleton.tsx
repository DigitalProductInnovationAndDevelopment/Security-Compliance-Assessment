import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";

export default function ProjectDetailAssessmentSkeleton() {
  return (
    <div className="relative h-full w-full rounded-lg sm:flex-1 sm:px-4">
      <div className="flex items-center gap-4">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-300" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} disabled>
              <div className="h-4 w-20 animate-pulse rounded bg-gray-300" />
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Array.from({ length: 6 }).map((_, index) => (
              <DropdownMenuItem
                key={index}
                className="h-4 w-32 animate-pulse rounded bg-gray-300"
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="my-4 h-full w-full rounded-lg bg-white p-4">
        <div className="flex h-full w-full justify-between gap-4">
          {/* Areas */}
          <div className="w-full border-black">
            <ScrollArea className="h-full">
              <Badge className="h-4 w-16 animate-pulse rounded bg-gray-300" />
              <Accordion type="single" collapsible defaultValue="item-2">
                {Array.from({ length: 8 }).map((_, key) => (
                  <AccordionItem key={key} value={`item-2`}>
                    <AccordionTrigger className="text-md flex text-left font-bold">
                      <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-300" />
                    </AccordionTrigger>
                    <AccordionContent className="mb-8 space-y-4 p-4">
                      <div className="space-y-4">
                        <div className="h-4 w-full animate-pulse rounded bg-gray-300" />
                        <div className="h-4 w-full animate-pulse rounded bg-gray-300" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300" />
                        <div className="h-4 w-2/4 animate-pulse rounded bg-gray-300" />
                      </div>
                      <div className="mt-4 h-16 w-full animate-pulse rounded bg-gray-200" />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
          {/* Artefacts */}
          <div className="w-full border-black">
            <ScrollArea className="h-full">
              <Badge className="h-4 w-16 animate-pulse rounded bg-gray-300" />
              <Accordion type="single" collapsible defaultValue="item-1">
                {Array.from({ length: 3 }).map((_, key) => (
                  <AccordionItem key={key} value={`item-1`}>
                    <AccordionTrigger className="text-md text-left font-bold">
                      <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-300" />
                    </AccordionTrigger>
                    <AccordionContent className="mb-8 space-y-4 p-4">
                      <div className="flex justify-between space-y-4">
                        <div className="items-top flex space-x-2">
                          <div className="mr-2 h-4 w-4 animate-pulse rounded bg-gray-300" />
                          <div className="grid gap-1.5 leading-none">
                            <div className="h-4 w-32 animate-pulse rounded bg-gray-300" />
                            <div className="h-3 w-24 animate-pulse rounded bg-gray-300" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 h-16 w-full animate-pulse rounded bg-gray-200" />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
