import fs from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt$${salt}$${hash}`;
}

async function main() {
  const seedDataPath = path.join(
    process.cwd(),
    "prisma",
    "seed-data",
    "demo-data.json",
  );
  const seedDataContent = fs.readFileSync(seedDataPath, "utf8");
  const seedData = JSON.parse(seedDataContent);

  const clientsByExternalId = new Map();

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

    clientsByExternalId.set(client.externalId, client);

    for (const prediction of clientSeed.predictions) {
      const predictionDate = new Date(
        `${prediction.predictionDate}T00:00:00.000Z`,
      );

      await prisma.prediction.upsert({
        where: {
          clientId_predictionDate: {
            clientId: client.id,
            predictionDate,
          },
        },
        update: {
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

  const client1 = clientsByExternalId.get("1");
  const client2 = clientsByExternalId.get("2");

  await prisma.user.upsert({
    where: {
      email: "admin@quantergy.com",
    },
    update: {
      passwordHash: hashPassword("admin123"),
      role: "ADMIN",
      clientId: null,
    },
    create: {
      email: "admin@quantergy.com",
      passwordHash: hashPassword("admin123"),
      role: "ADMIN",
    },
  });

  if (client1) {
    await prisma.user.upsert({
      where: {
        email: "client1@quantergy.com",
      },
      update: {
        passwordHash: hashPassword("client123"),
        role: "CLIENT",
        clientId: client1.id,
      },
      create: {
        email: "client1@quantergy.com",
        passwordHash: hashPassword("client123"),
        role: "CLIENT",
        clientId: client1.id,
      },
    });
  }

  if (client2) {
    await prisma.user.upsert({
      where: {
        email: "client2@quantergy.com",
      },
      update: {
        passwordHash: hashPassword("client789"),
        role: "CLIENT",
        clientId: client2.id,
      },
      create: {
        email: "client2@quantergy.com",
        passwordHash: hashPassword("client789"),
        role: "CLIENT",
        clientId: client2.id,
      },
    });
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
