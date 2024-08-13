"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Slider } from "~/components/ui/slider";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Checkbox } from "~/components/ui/checkbox";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ArtifactDialog } from "~/components/ui/artifactCard";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { Project } from "@prisma/client";
import useProjectDetailsStore from "~/stores/useProjectDetailsStore";
import { api } from "~/trpc/react";
import { AreaSheet } from "./AreaSheet";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ProjectDetailAssessmentSkeleton from "./ProjectDetailAssessmentSkeleton";

export default function ProjectDetailAssessment({
  project,
}: {
  project: Project & { assessments: unknown[] };
}) {
  const session = useSession();
  const { currentStage, setCurrentStage } = useProjectDetailsStore();
  const { data: stages, isLoading: isStagesLoading } =
    api.refa.stages.useQuery();
  const {
    data: areas,
    isLoading: isAreasLoading,
    refetch: refetchAreas,
  } = api.refa.areasWithArtefactsByStage.useQuery({
    stageNumber: currentStage.stageNumber,
  });
  const {
    data: artefacts,
    isLoading: isArtefactsLoading,
    refetch: refetchArtefacts,
  } = api.refa.artefactsByStage.useQuery({
    stageNumber: currentStage.stageNumber,
  });

  const {
    data: existingAssessment,
    refetch: refetchAssessment,
    isLoading: isAssessmentLoading,
  } = api.assessment.getExistingAssessment.useQuery({
    userId: session.data?.user.id || "",
    projectId: project.id,
    stageNumber: currentStage.stageNumber,
  });

  useEffect(() => {
    if (currentStage.id === -1 && stages?.[0]) {
      setCurrentStage(stages[0]);
    }
  }, [stages]);

  const { data, refetch: refetchProjectStatistics } = api.assessment.getProjectStatistics.useQuery({
    projectId: project.id,
    stageId: currentStage.id, // Use current stage ID from the store
  });

  const [answersArea, setAnswersArea] = useState<
    {
      questionId: number;
      assessedScore: number;
      targetScore: number;
      answered: boolean;
      comment: string;
    }[]
  >([]);
  const [answersArtefact, setAnswersArtefact] = useState<
    {
      artefactId: number;
      answered: boolean;
      answer: boolean;
      comment: string;
    }[]
  >([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { mutateAsync: createAssessment, isPending: isSubmitting } =
    api.assessment.createAssessment.useMutation();

  const { mutateAsync: createAreasScores } =
    api.assessment.createAreasScores.useMutation();

  useEffect(() => {
    if (existingAssessment) {
      setAnswersArea(
        existingAssessment.answersArea.map((answer) => ({
          questionId: answer.questionId,
          assessedScore: answer.assessedScore,
          targetScore: answer.targetScore,
          answered: answer.answered,
          comment: answer.comment || "",
        })),
      );
      setAnswersArtefact(
        existingAssessment.answersArtefact.map((answer) => ({
          artefactId: answer.artefactId,
          answered: answer.answered,
          answer: answer.answer,
          comment: answer.comment || "",
        })),
      );
    }
  }, [existingAssessment]);

  const handleAreaChange = (
    questionId: number,
    score: number,
    targetScore: number,
    comment?: string,
  ) => {
    setAnswersArea((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        if (
          existing.assessedScore !== score ||
          existing.targetScore !== targetScore ||
          (comment !== undefined && existing.comment !== comment)
        ) {
          setHasChanges(true);
        }
        return prev.map((a) =>
          a.questionId === questionId
            ? {
                ...a,
                assessedScore: score,
                targetScore,
                comment: comment !== undefined ? comment : a.comment,
              }
            : a,
        );
      } else {
        setHasChanges(true);
        return [
          ...prev,
          {
            questionId,
            assessedScore: score,
            targetScore,
            answered: true,
            comment: comment || "",
          },
        ];
      }
    });
  };

  const handleArtefactChange = (
    artefactId: number,
    answered: boolean,
    answer: boolean,
    comment: string,
  ) => {
    setAnswersArtefact((prev) => {
      const existing = prev.find((a) => a.artefactId === artefactId);
      if (existing) {
        if (
          existing.answered !== answered ||
          existing.answer !== answer ||
          existing.comment !== comment
        ) {
          setHasChanges(true);
        }
        return prev.map((a) =>
          a.artefactId === artefactId
            ? { ...a, answered, answer, comment: comment || "" }
            : a,
        );
      } else {
        setHasChanges(true);
        return [
          ...prev,
          { artefactId, answered, answer, comment: comment || "" },
        ];
      }
    });
  };

  const handleSubmitAssessment = async () => {
    if (!session.data?.user.id) {
      toast({
        title: "Please sign in to submit an assessment",
        description: "You must be signed in to submit an assessment",
        variant: "destructive",
      });
      return;
    }

    // Handle default cases for unanswered questions and unchecked artefacts
    const finalAnswersArea = areas?.areas.flatMap((area) =>
      area.assessment_questions.map((question) => {
        const existing = answersArea.find(
          (answer) => answer.questionId === question.id,
        );
        return (
          existing || {
            questionId: question.id,
            assessedScore: 0, // Default score for unanswered
            targetScore: 5, // Default target score
            answered: false, // Mark as not answered
            comment: "", // No comment
          }
        );
      }),
    );

    const finalAnswersArtefact = artefacts?.map((artefact) => {
      const existing = answersArtefact.find(
        (answer) => answer.artefactId === artefact.id,
      );
      return (
        existing || {
          artefactId: artefact.id,
          answered: false, // Default as not answered
          answer: false, // Artefact not handled
          comment: "", // No comment
        }
      );
    });

    try {
      await createAssessment({
        userId: session.data.user.id,
        projectId: project.id,
        areasMaturityScore: 0, // Adjust this logic to compute maturity score if needed
        artefactCompletenessScore: 0, // Adjust this logic to compute completeness score if needed
        areaCompletenessScore: 0, // Adjust this logic to compute completeness score if needed
        answersArea: finalAnswersArea || [],
        answersArtefact: finalAnswersArtefact || [],
        stageId: currentStage.id,
      });
      await createAreasScores({
        projectId: project.id,
        stageId: currentStage.id,
        answersArea: finalAnswersArea || [],
      });
      setHasChanges(false); // Reset changes flag after successful submission
      toast({
        title: "Assessment created successfully",
        description: "Your assessment has been submitted successfully.",
        variant: "default",
      });
      await Promise.all([refetchProjectStatistics(), refetchAssessment()]);
      console.log("Assessment created successfully");
    } catch (error) {
      console.error("Error creating assessment", error);
      toast({
        title: "Error creating assessment",
        description:
          `An error occurred while creating the assessment: ${error}`,
        variant: "destructive",
      });
    }
  };

  // Conditionally render content only when data is fully loaded
  if (
    isAssessmentLoading ||
    isStagesLoading ||
    isAreasLoading ||
    isArtefactsLoading
  ) {
    return <ProjectDetailAssessmentSkeleton />;
  }

  return (
    <div className="relative h-full w-full rounded-lg sm:flex-1 sm:px-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{currentStage.name}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                Change Stage
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {stages?.map((stage) => (
                <DropdownMenuItem
                  key={stage.name}
                  onSelect={async () => {
                    if (stage.id !== currentStage.stageNumber) {
                      setCurrentStage(stage);
                      await Promise.all([refetchAreas(), refetchArtefacts()]);
                    }
                  }}
                >
                  {stage.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitAssessment}
            disabled={!hasChanges || isSubmitting} // Disable if no changes or API is running
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </Button>
        </div>
      </div>
      <div className="my-4 h-full w-full rounded-lg bg-white p-4">
        <div className="flex h-full w-full justify-between gap-4">
          {/* Areas */}
          <div className="w-full border-black">
            <ScrollArea className="h-full">
              <Badge className="text-xs" variant={"outline"}>
                Areas
              </Badge>
              <Accordion
                type="single"
                collapsible={false}
                defaultValue="item-1"
              >
                {areas?.areas.map((area, key) => (
                  <AccordionItem key={key} value={`item-1`}>
                    <AccordionTrigger className="text-md flex text-left font-bold">
                      <span className="inline-flex items-center gap-2">
                        <AreaSheet area={area}>
                          <InfoCircledIcon className="min-h-5 min-w-5" />
                        </AreaSheet>
                        <span className="line-clamp-1">{area.area_name}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="mb-8 space-y-12 p-4">
                      {area.assessment_questions.map((question, key) => {
                        const existingAnswer = answersArea.find(
                          (answer) => answer.questionId === question.id,
                        );
                        return (
                          <div key={question.id} className="space-y-4">
                            <p className="text-sm font-bold">{question.body}</p>
                            <div className="w-full">
                              <input
                                type="range"
                                className="w-full"
                                value={existingAnswer?.assessedScore || 0}
                                min={0}
                                max={5}
                                step={1}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value, 10);
                                  handleAreaChange(
                                    question.id,
                                    value,
                                    existingAnswer?.targetScore || 5,
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
                              value={existingAnswer?.comment || ""}
                              onChange={(e) =>
                                handleAreaChange(
                                  question.id,
                                  existingAnswer?.assessedScore || 0,
                                  existingAnswer?.targetScore || 5,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
          {/* Artefacts */}
          <div className="w-full border-black">
            <ScrollArea className="h-full">
              <Badge className="text-xs" variant={"outline"}>
                Artefacts
              </Badge>
              <Accordion
                type="single"
                collapsible={false}
                defaultValue="item-1"
              >
                {artefacts?.map((artefact, key) => {
                  const existingAnswer = answersArtefact.find(
                    (answer) => answer.artefactId === artefact.id,
                  );
                  return (
                    <AccordionItem key={key} value={`item-1`}>
                      <AccordionTrigger className="text-md text-left font-bold">
                        <span className="inline-flex items-center gap-2">
                          <ArtifactDialog
                            id={artefact.artefact_id}
                          >
                            <InfoCircledIcon className="min-h-5 min-w-5" />
                          </ArtifactDialog>
                          <span className="line-clamp-1">
                            {artefact.artefact_name}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="mb-8 space-y-4 p-4">
                        <div className="flex justify-between space-y-4">
                          <div className="items-top flex space-x-2">
                            <Checkbox
                              id={`checkbox-${artefact.artefact_id}`}
                              checked={existingAnswer?.answered || false}
                              onCheckedChange={(checked: boolean) => {
                                handleArtefactChange(
                                  artefact.id,
                                  checked,
                                  existingAnswer?.answer || false,
                                  existingAnswer?.comment || "",
                                );
                              }}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={`checkbox-${artefact.artefact_id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                This artefact is handled
                              </label>
                              <p className="text-sm text-muted-foreground">
                                The project satisfies the requirements of this
                                artefact
                              </p>
                            </div>
                          </div>
                        </div>
                        <textarea
                          className="w-full border-2 p-2"
                          placeholder="Leave your comment here... (optional)"
                          value={existingAnswer?.comment || ""}
                          onChange={(e) =>
                            handleArtefactChange(
                              artefact.id,
                              existingAnswer?.answered || false,
                              existingAnswer?.answer || false,
                              e.target.value,
                            )
                          }
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
