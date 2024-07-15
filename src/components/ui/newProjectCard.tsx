import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

const NewProjectCard: React.FC = () => {
  return (
    <Card className="m-2 min-w-fit p-2">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-center">Create New Project</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <Button className="rounded-full bg-purple-500 p-8 text-3xl text-white">
          +
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewProjectCard;
