import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Fetch all areas from the database
  const areas = await prisma.area.findMany();

  // Iterate over each area and create two questions
  for (const area of areas) {
    await prisma.question.create({
      data: {
        body: `What are the key practices for the area ${area.area_name}?`,
        areas: {
          connect: { id: area.id },
        },
      },
    });

    await prisma.question.create({
      data: {
        body: `How is the area ${area.area_name} being evaluated for its effectiveness?`,
        areas: {
          connect: { id: area.id },
        },
      },
    });
  }

  console.log("Seeded two questions for each area");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
