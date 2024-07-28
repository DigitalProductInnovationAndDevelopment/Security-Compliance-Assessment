"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { PlusCircleIcon } from "lucide-react";
import { Label } from "./ui/label";

export default function AddNewProjectCard() {
  return (
    <Card className="relative w-full max-w-sm sm:flex-1">
      <CardHeader className="bg-slate-100">
        <CardTitle className="text-center text-2xl font-bold">
          Add a new Project
        </CardTitle>
        <CardDescription className="text-center opacity-0">
          Create a new project
        </CardDescription>
      </CardHeader>
      <CardContent className="relative h-[70%]">
        <div className="flex h-full flex-col items-center justify-center">
          <Tooltip>
            <TooltipTrigger onClick={() => alert("Add a new Project")}>
              <PlusCircleIcon className="h-8 w-8 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <Label>Add a new Project</Label>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
