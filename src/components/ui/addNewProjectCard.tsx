"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { PlusCircleIcon } from "lucide-react";
import { Label } from "./label";

export default function AddNewProjectCard() {
  return (
    <Card className="relative w-full max-w-sm sm:flex-1">
      <CardHeader className="bg-slate-100">
        <CardTitle className="text-center text-2xl font-bold">
          Add a New Project
        </CardTitle>
        <CardDescription className="text-center opacity-0">
          Create a new project
        </CardDescription>
      </CardHeader>
      <CardContent className="relative h-[70%]">
        <div className="flex h-full flex-col items-center justify-center">
          <Tooltip>
            <TooltipTrigger onClick={() => alert("Add a New Project")}>
              <PlusCircleIcon className="h-8 w-8 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <Label>Add a New Project</Label>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
