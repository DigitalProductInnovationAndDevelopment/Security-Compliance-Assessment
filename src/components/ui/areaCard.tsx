"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";
import { cn } from "~/lib/utils";
import useProjectDetailsStore from "~/stores/useProjectDetailsStore";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";
import { ScrollArea } from "./scroll-area";

export interface AreaProps {
  id: string;
  name: string;
  visible?: boolean;
  toggleVisibility?: () => void;
}

const AreaCard = React.forwardRef<HTMLDivElement, AreaProps>((area, ref) => {
  const { data: session } = useSession();
  const userLoggedIn = !!session;
  const [loading, setLoading] = useState(true);

  const { currentProject, currentStage } = useProjectDetailsStore();

  const { data: areaDetails, isFetched: isAreaFetched } =
    api.refa.areaByAreaId.useQuery({
      area_id: area.id,
    });

  const {
    data: areaScore,
    isFetched: isScoreFetched,
    refetch: refetchAreaScore,
  } = api.assessment.getAreaScore.useQuery(
    {
      projectId: currentProject?.id || -1,
      areaId: areaDetails?.id || -1,
    },
    {
      enabled: userLoggedIn && !!currentProject?.id && !!areaDetails?.id,
      refetchOnWindowFocus: "always",
    },
  );

  const { data: areaAssessment, refetch: refetchAreaAssessment } =
    api.assessment.getAreaAssessment.useQuery({
      projectId: currentProject?.id || -1,
      areaId: area.id, // Pass as number
    });

  const [answers, setAnswers] = useState(areaAssessment?.questions || []);

  // Ensure answers state is updated when areaAssessment data is fetched
  useEffect(() => {
    if (areaAssessment) {
      setAnswers(areaAssessment.questions);
    }
  }, [areaAssessment]);

  const { mutateAsync: createAreasScores } =
    api.assessment.createAreaScoresForArea.useMutation();

  const handleAnswerChange = (
    questionId: number,
    assessedScore: number,
    targetScore: number,
    comment?: string,
  ) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, assessedScore, targetScore, comment: comment ?? "" }
          : answer,
      ),
    );
  };

  const { mutateAsync: submitAreaAssessment, isPending: isSubmitting } =
    api.assessment.submitAreaAssessment.useMutation();

  const handleSubmit = async () => {
    try {
      await submitAreaAssessment({
        projectId: currentProject?.id || -1,
        areaId: area.id, // Pass as string
        answers,
      });
      await createAreasScores({
        projectId: currentProject?.id || -1,
        areaId: areaDetails?.id || -1,
        answersArea: answers.map((answer) => ({
          questionId: answer.questionId,
          assessedScore: answer.assessedScore,
          targetScore: answer.targetScore,
          comment: answer.comment || "",
          answered: true,
        })),
      });
      toast({
        title: "Assessment submitted",
        description: "Your assessment has been saved successfully.",
        variant: "default",
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refetchAreaScore();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refetchAreaAssessment();
    } catch (error) {
      toast({
        title: "Error submitting assessment",
        description: `An error occurred: ${error}`,
        variant: "destructive",
      });
    }
  };

  const areaMaturityScore = areaScore?.areaMaturityScore ?? 0;
  const targetAreaMaturityScore = areaScore?.targeAreaMaturityScore ?? 1;

  const maturityScore = (areaMaturityScore / targetAreaMaturityScore) * 100;

  const backgroundColor = userLoggedIn
    ? maturityScore == null || maturityScore < 20
      ? "text-black bg-[hsl(var(--assessment-level-0))]"
      : maturityScore >= 20 && maturityScore < 40
        ? "text-black bg-[hsl(var(--assessment-level-1))]"
        : maturityScore >= 40 && maturityScore < 60
          ? "text-white bg-[hsl(var(--assessment-level-2))]"
          : maturityScore >= 60 && maturityScore < 80
            ? "text-white bg-[hsl(var(--assessment-level-3))]"
            : maturityScore >= 80 && maturityScore < 100
              ? "text-white bg-[hsl(var(--assessment-level-4))]"
              : maturityScore === 100
                ? "text-white bg-[hsl(var(--assessment-level-5))]"
                : ""
    : ""; // if not loggedIn show no color coding

  useEffect(() => {
    if (!userLoggedIn) {
      setLoading(false);
    }
    if (userLoggedIn && isAreaFetched && isScoreFetched) {
      setLoading(false);
    }
  }, [isAreaFetched, isScoreFetched, userLoggedIn]);

  return (
    <>
      {loading ? (
        <div className="flex animate-pulse items-center justify-center p-4">
          <div className="h-16 w-full max-w-md rounded bg-gray-100"></div>
        </div>
      ) : (
        <Card
          title={area.name}
          className={cn(
            "flex h-full w-full flex-col items-center justify-center",
            backgroundColor,
          )}
        >
          <div className="absolute right-2 top-2 mr-2 h-7 space-x-1 rounded-xl bg-white p-1">
            <Button
              variant="outline"
              size="icon"
              className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground"
              onClick={area.toggleVisibility}
            >
              {area.visible ? <Icons.show /> : <Icons.hide />}
            </Button>
            {/* Info icon to trigger info sheet */}
            <SheetTrigger>
              <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
                <Icons.info />
              </div>
            </SheetTrigger>
            {/* If user is logged in, edit icon to trigger assess sheet */}
            {userLoggedIn && (
              <Sheet>
                <SheetTrigger>
                  <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
                    <Icons.edit />
                  </div>
                </SheetTrigger>
                <SheetContent className="lg:min-w-[40vw]">
                  <SheetHeader>
                    <SheetTitle className="text-center">
                      <div>Assess Area: </div>
                      {area.name}
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[95vh] pr-4">
                    <div className="mt-4 space-y-8">
                      {answers.map((question) => (
                        <div key={question.questionId} className="space-y-4">
                          <p className="text-sm font-bold">
                            {question.questionBody}
                          </p>
                          <div className="w-full">
                            <input
                              type="range"
                              className="w-full"
                              value={question.assessedScore || 0}
                              min={0}
                              max={5}
                              step={1}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                handleAnswerChange(
                                  question.questionId,
                                  value,
                                  question.targetScore,
                                  question.comment,
                                );
                              }}
                            />
                            <div className="flex w-full justify-between">
                              {[
                                "sit",
                                "crawl",
                                "walk",
                                "run",
                                "jump",
                                "fly",
                              ].map((activity) => (
                                <div
                                  key={activity}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-sm font-medium">
                                    {activity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <textarea
                            className="mr-2 w-full border-2 p-2"
                            placeholder="Leave your comment here... (optional)"
                            rows={3}
                            value={question.comment || ""}
                            onChange={(e) =>
                              handleAnswerChange(
                                question.questionId,
                                question.assessedScore,
                                question.targetScore,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      className="mb-12 ml-auto mt-2 flex"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      Submit Assessment
                    </Button>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            )}
          </div>
          {userLoggedIn && (
            <div
              className={cn(
                "text-bold absolute bottom-2 right-2 space-x-1 text-sm",
                backgroundColor,
              )}
            >
              {maturityScore.toFixed(0)}%
            </div>
          )}
          <CardHeader
            className="flex flex-col items-center justify-center"
            title={area.name}
          >
            <CardTitle className="text-center">{area.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-center">
              <p className={cn("text-sm text-gray-500", backgroundColor)}>
                {area.id}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
});
AreaCard.displayName = "AreaCard";

export { AreaCard };
