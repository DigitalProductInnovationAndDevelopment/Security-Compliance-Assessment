import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface ProjectCardProps {
  project_name: string;
  compliance_score: number;
  code_phase: number;
  build_phase: number;
  deploy_phase: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project_name,
  compliance_score,
  code_phase,
  build_phase,
  deploy_phase,
}) => {
  return (
    <Card className="m-2 min-w-fit p-2">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-center">{project_name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">Compliance Score Overview</p>
          <div className="relative pt-1">
            <div className="flex h-2 overflow-hidden rounded bg-purple-200 text-xs">
              <div
                style={{ width: `${compliance_score}%` }}
                className="flex flex-col justify-center whitespace-nowrap bg-purple-500 text-center text-white shadow-none"
              ></div>
            </div>
            <span className="text-xs text-gray-600">{compliance_score}%</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Action Required:</p>
          <p className="text-sm text-gray-600">Code Phase: {code_phase}%</p>
          <p className="text-sm text-gray-600">Build Phase: {build_phase}%</p>
          <p className="text-sm text-gray-600">Deploy Phase: {deploy_phase}%</p>
        </div>
        <Button className="mt-2">Assess Project</Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
