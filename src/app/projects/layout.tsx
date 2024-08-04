import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="relative w-full px-6">
      {children}
    </div>
  );
}
