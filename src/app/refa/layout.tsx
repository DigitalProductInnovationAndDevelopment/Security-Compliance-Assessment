import React from "react";
import { ModelControlPanel } from "~/components/ui/modelControlPanel";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stages = await api.refa.stages();

  return (
    <div className="relative w-full px-6">
      <ModelControlPanel stages={stages} />
      {children}
    </div>
  );
}
