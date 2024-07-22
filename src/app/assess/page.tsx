import { getServerAuthSession } from "~/server/auth";
import Unauthorised from "~/components/unauthorised";

import React from "react";

export default async function Page() {
  const session = await getServerAuthSession();

  if (!session) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center text-center">
          <Unauthorised />
        </div>
      </div>
    );
  }
  return (
    <div className="relative min-h-full w-full rounded-lg bg-white p-8">
      <div className="flex min-w-full flex-wrap gap-4" />
    </div>
  );
}
