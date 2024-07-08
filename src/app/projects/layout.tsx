import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const project_statuses = ["past-projects", "active-projects"];
  const displayNames: Record<string, string> = {
    "past-projects": "Past Projects",
    "active-projects": "Active Projects",
  };

  return (
    <div className="relative w-full px-6">
      <div className="-ml-3 flex min-w-full">
        {project_statuses.map((project_status) => (
          <div key={project_status} className="border-gray-200 py-4">
            <div className="flex flex-row">
              <span className="inline-flex items-center">
                <Link href={"/projects/" + project_status}>
                  <Button variant={"link"} className="text-md font-medium">
                    {displayNames[project_status]}
                  </Button>
                </Link>
              </span>
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
