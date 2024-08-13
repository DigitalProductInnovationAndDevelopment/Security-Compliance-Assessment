import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const assessmentRouter = createTRPCRouter({
  getAssessments: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      const assessments = await ctx.db.assessment.findMany({
        where: {
          projectId: input.projectId,
        },
      });
      return assessments;
    }),
  createAssessment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        projectId: z.number(),
        areasMaturityScore: z.number(),
        artefactCompletenessScore: z.number(),
        areaCompletenessScore: z.number(),
        stageId: z.number(), // Include stageId or stageNumber in the input
        answersArea: z.array(
          z.object({
            questionId: z.number(),
            assessedScore: z.number(),
            targetScore: z.number(),
            answered: z.boolean(),
            comment: z.string().optional(),
          }),
        ),
        answersArtefact: z.array(
          z.object({
            artefactId: z.number(),
            comment: z.string().optional(),
            answered: z.boolean(),
            answer: z.boolean(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        userId,
        projectId,
        areasMaturityScore,
        artefactCompletenessScore,
        areaCompletenessScore,
        stageId, // or stageNumber if that's how you identify stages
        answersArea,
        answersArtefact,
      } = input;

      // Ensure the stage exists
      const stage = await ctx.db.stage.findUnique({
        where: { id: stageId },
      });

      if (!stage) {
        throw new Error(`Stage with id ${stageId} does not exist.`);
      }

      // Step 1: Upsert the assessment record or update if it already exists
      const assessment = await ctx.db.assessment.upsert({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
        update: {
          areasMaturityScore,
          artefactCompletenessScore,
          areaCompletenessScore,
        },
        create: {
          userId,
          projectId,
          areasMaturityScore,
          artefactCompletenessScore,
          areaCompletenessScore,
        },
      });

      // Step 2: Upsert the StageScore record
      await ctx.db.stageScore.upsert({
        where: {
          assessmentUserId_assessmentProjectId_stageId: {
            assessmentUserId: userId,
            assessmentProjectId: projectId,
            stageId: stageId, // Use stageId or stageNumber appropriately
          },
        },
        update: {
          areaMaturityScore: areasMaturityScore,
          areaCompletenessScore: areaCompletenessScore,
          artefactsCompletenessScore: artefactCompletenessScore,
        },
        create: {
          assessmentUserId: userId,
          assessmentProjectId: projectId,
          stageId: stageId,
          areaMaturityScore: areasMaturityScore,
          areaCompletenessScore: areaCompletenessScore,
          artefactsCompletenessScore: artefactCompletenessScore,
          targetAreaMaturityScore: 1, // Adjust this logic if necessary
        },
      });

      // Step 3: Upsert the AnswerAreaQuestion records
      for (const answer of answersArea) {
        await ctx.db.answerAreaQuestion.upsert({
          where: {
            assessmentUserId_assessmentProjectId_questionId: {
              assessmentUserId: userId,
              assessmentProjectId: projectId,
              questionId: answer.questionId,
            },
          },
          update: {
            assessedScore: answer.assessedScore,
            targetScore: answer.targetScore,
            answered: answer.answered,
            comment: answer.comment || "",
          },
          create: {
            assessmentUserId: userId,
            assessmentProjectId: projectId,
            questionId: answer.questionId,
            assessedScore: answer.assessedScore,
            targetScore: answer.targetScore,
            answered: answer.answered,
            comment: answer.comment || "",
          },
        });
      }

      // Step 4: Upsert the AnswerArtefact records
      for (const answer of answersArtefact) {
        await ctx.db.answerArtefact.upsert({
          where: {
            assessmentUserId_assessmentProjectId_artefactId: {
              assessmentUserId: userId,
              assessmentProjectId: projectId,
              artefactId: answer.artefactId,
            },
          },
          update: {
            comment: answer.comment || "",
            answered: answer.answered,
            answer: answer.answer,
          },
          create: {
            assessmentUserId: userId,
            assessmentProjectId: projectId,
            artefactId: answer.artefactId,
            comment: answer.comment || "",
            answered: answer.answered,
            answer: answer.answer,
          },
        });
      }

      return assessment;
    }),

  getExistingAssessment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        projectId: z.number(),
        stageNumber: z.number(), // Assuming you identify the stage with this
      }),
    )
    .query(async ({ input, ctx }) => {
      const { userId, projectId, stageNumber } = input;

      // Fetch the existing assessment based on userId, projectId, and stageNumber
      const assessment = await ctx.db.assessment.findFirst({
        where: {
          userId,
          projectId,
          stagesScores: {
            some: {
              stage: {
                stageNumber,
              },
            },
          },
        },
        include: {
          answersArea: true,
          answersArtefact: true,
        },
      });

      // Return the assessment data, or null if no assessment exists
      if (!assessment) {
        return null;
      }

      return {
        answersArea: assessment.answersArea.map((answer) => ({
          questionId: answer.questionId,
          assessedScore: answer.assessedScore,
          targetScore: answer.targetScore,
          answered: answer.answered,
          comment: answer.comment,
        })),
        answersArtefact: assessment.answersArtefact.map((answer) => ({
          artefactId: answer.artefactId,
          answered: answer.answered,
          answer: answer.answer,
          comment: answer.comment,
        })),
      };
    }),
  createAreasScores: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        stageId: z.number(),
        answersArea: z.array(
          z.object({
            questionId: z.number(),
            assessedScore: z.number(),
            targetScore: z.number(),
            answered: z.boolean(),
            comment: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { projectId, stageId, answersArea } = input;

      const stage = await ctx.db.stage.findUnique({
        where: { id: stageId },
        include: {
          areas: {
            include: {
              assessment_questions: true,
            },
          },
        },
      });

      if (!stage) {
        throw new Error(`Stage with id ${stageId} does not exist.`);
      }

      const areaCompletenessScore = answersArea.filter(
        (answer) => answer.answered,
      ).length;

      const aggregatedByArea = stage.areas.map((area) => {
        // Get the question IDs for the current area
        const areaQuestionIds = area.assessment_questions.map((q) => q.id);

        // Filter answers that belong to the current area
        const areaAnswers = answersArea.filter((answer) =>
          areaQuestionIds.includes(answer.questionId),
        );

        // Aggregate the data you need for this area
        const totalQuestions = areaAnswers.length;
        const answeredCount = areaAnswers.filter(
          (answer) => answer.answered,
        ).length;
        const totalAssessedScore = areaAnswers.reduce(
          (sum, answer) => sum + answer.assessedScore,
          0,
        );
        const totalTargetScore = areaAnswers.reduce(
          (sum, answer) => sum + answer.targetScore,
          0,
        );
        const averageAssessedScore = totalAssessedScore / totalQuestions;
        const averageTargetScore = totalTargetScore / totalQuestions;

        return {
          areaId: area.id,
          answeredCount,
          averageAssessedScore,
          averageTargetScore,
        };
      });

      for (const areaData of aggregatedByArea) {
        const {
          areaId,
          answeredCount,
          averageAssessedScore,
          averageTargetScore,
        } = areaData;

        await ctx.db.areaScore.upsert({
          where: {
            assessmentUserId_assessmentProjectId_areaId: {
              assessmentUserId: userId,
              assessmentProjectId: projectId,
              areaId: areaId,
            },
          },
          update: {
            areaMaturityScore: averageAssessedScore,
            areaCompletenessScore: answeredCount,
            targeAreaMaturityScore: averageTargetScore,
            // update the following commented out fields if needed
            // artefactsCompletenessScore: 0, // compute if needed
          },
          create: {
            assessmentUserId: userId,
            assessmentProjectId: projectId,
            areaId: areaId,
            areaMaturityScore: averageAssessedScore,
            areaCompletenessScore: answeredCount,
            artefactsCompletenessScore: 0, // compute if needed
            targeAreaMaturityScore: averageTargetScore,
          },
        });
      }
    }),
});
