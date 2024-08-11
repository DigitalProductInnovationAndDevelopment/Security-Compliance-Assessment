import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const dataDirectory = "./assessment_questions";

async function seedQuestions() {
  const accumulatedFile = path.join(dataDirectory, "assessment_questions.json"); // Adjust path if needed
  const content = fs.readFileSync(accumulatedFile, "utf-8");
  const data = JSON.parse(content);

  await handleQuestionData(data);

  console.log("Question data import complete.");
}

async function handleQuestionData(data: any) {
  const { areas } = data;

  for (const area of areas) {
    const { area_id, area_name, stage, questions } = area;

    const stageModel = await prisma.stage.findUnique({
      where: {
        name: stage,
      },
    });

    if (stageModel) {
      // Find the area by area_id, area_name, and stageId (unique constraint)
      const areaModel = await prisma.area.findUnique({
        where: {
          area_id_area_name_stageId: {
            area_id: area_id,
            area_name: area_name,
            stageId: stageModel.id,
          },
        },
        include: {
          assessment_questions: true, // Correctly include the assessment_questions relation
        },
      });

      if (areaModel) {
        for (const questionText of questions) {
          // Check if the question already exists for this area
          const existingQuestion = areaModel.assessment_questions.find(
            (question) => question.body === questionText,
          );

          if (!existingQuestion) {
            // If the question does not exist, create it
            await prisma.question.create({
              data: {
                body: questionText,
                areas: {
                  connect: { id: areaModel.id },
                },
              },
            });

            console.log(
              `Added question: "${questionText}" to area ${areaModel.area_name}`,
            );
          } else {
            console.log(
              `Question: "${questionText}" already exists for area ${areaModel.area_name}`,
            );
          }
        }
      } else {
        console.warn(
          `Area with area_id: ${area_id} and area_name: ${area_name} not found.`,
        );
      }
    } else {
      console.warn(`Stage with name: ${stage} not found.`);
    }
  }
  console.log("Questions seeding complete.");
}

async function main() {
  try {
    await seedQuestions();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
