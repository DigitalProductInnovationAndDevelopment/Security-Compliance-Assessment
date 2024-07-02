import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { DM_Sans as FontSans } from "next/font/google";
import { cn } from "~/lib/utils";
import Header from "~/components/header";
import { NextAuthProvider } from "./providers/NextAuthProvider";
import { get } from "http";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "Security Compliance Assessment",
  description:
    "Siemens Security Compliance Assessment Tool — Digitial Product Innovation",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <NextAuthProvider>
          <TRPCReactProvider>
            <Header session={session} />
            {children}
          </TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
