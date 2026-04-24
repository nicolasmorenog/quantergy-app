import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const seedDataPath = path.join(
    process.cwd(),
    "prisma",
    "seed-data",
    "demo-data.json",
  );
  const seedDataContent = fs.readFileSync(seedDataPath, "utf8");
  const seedData = JSON.parse(seedDataContent);

  for (const clientSeed of seedData.clients) {
    const client = await prisma.client.upsert({
      where: {
        externalId: clientSeed.externalId,
      },
      update: {
        displayName: clientSeed.displayName ?? null,
        unit: clientSeed.unit,
      },
      create: {
        externalId: clientSeed.externalId,
        displayName: clientSeed.displayName ?? null,
        unit: clientSeed.unit,
      },
    });

    for (const prediction of clientSeed.predictions) {
      const predictionDate = new Date(
        `${prediction.predictionDate}T00:00:00.000Z`,
      );

      await prisma.prediction.upsert({
        where: {
          predictionDate,
        },
        update: {
          clientId: client.id,
          predictedValue: prediction.predictedValue,
          realValue: prediction.realValue,
          source: prediction.source ?? "demo-seed",
        },
        create: {
          clientId: client.id,
          predictionDate,
          predictedValue: prediction.predictedValue,
          realValue: prediction.realValue,
          source: prediction.source ?? "demo-seed",
        },
      });
    }
  }

  console.log(
    `Seed completed for ${seedData.clients.length} client(s).`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
