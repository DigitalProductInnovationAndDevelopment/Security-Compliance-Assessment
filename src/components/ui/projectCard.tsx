import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface ProjectCardProps {
  project_name: string;
  compliance_score: number;
  areas_score: number;
  artifacts_score: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project_name,
  compliance_score,
  areas_score,
  artifacts_score,
}) => {
  return (
    <Card className="m-2 min-w-fit p-2">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-center">{project_name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">Overall Compliance Score</p>
          <div className="relative pt-1">
            <div className="flex h-2 overflow-hidden rounded bg-purple-200 text-xs">
              <div
                style={{ width: `${compliance_score}%` }}
                className="flex flex-col justify-center whitespace-nowrap bg-purple-500 text-center text-white shadow-none"
              ></div>
            </div>
            <span className="text-xs text-gray-600">{compliance_score}%</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Progress Overview:</p>
          <p className="text-sm text-gray-600">Areas: {areas_score}%</p>
          <div className="relative pt-1">
            <div className="flex h-2 overflow-hidden rounded bg-purple-200 text-xs">
              <div
                style={{ width: `${areas_score}%` }}
                className="flex flex-col justify-center whitespace-nowrap bg-purple-500 text-center text-white shadow-none"
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">Artifacts: {artifacts_score}%</p>
          <div className="relative pt-1">
            <div className="flex h-2 overflow-hidden rounded bg-purple-200 text-xs">
              <div
                style={{ width: `${artifacts_score}%` }}
                className="flex flex-col justify-center whitespace-nowrap bg-purple-500 text-center text-white shadow-none"
              ></div>
            </div>
          </div>
        </div>
        <Button className="mt-2 bg-purple-500">Assess Project</Button>
        <Button className="mt-2 bg-purple-500">Assessment Result</Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
