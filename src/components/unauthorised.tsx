"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { signIn } from "next-auth/react";
import SecmoLogo from "../../public/secmo.png";
import Image from "next/image";

export default function Unauthorised() {
  return (
    <Card>
      <CardHeader className="flex h-full w-full justify-between">
        <CardTitle className="flex justify-center">
          <Image src={SecmoLogo} height={40} width={40} alt="Secmo Logo" />
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
