"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import SiemensLogo from "./siemens-logo";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { signIn } from "next-auth/react";

export default function Unauthorised() {
  return (
    <Card>
      <CardHeader className="flex h-full w-full justify-between">
        <CardTitle className="flex justify-center">
          <SiemensLogo width={150} height={150} />
        </CardTitle>
      </CardHeader>
      <CardDescription></CardDescription>
      <CardContent className="space-y-2">
        <p className="text-md font-medium">
          You have to be logged in to access this page
        </p>
        <Button
          onClick={() => signIn("google")}
          className="font-medium"
          variant="outline"
          type="button"
        >
          {false ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  );
}
