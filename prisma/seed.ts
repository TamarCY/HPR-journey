import { PrismaClient, ActivityType, BreathingSlot } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding activities...");

  await prisma.activity.deleteMany();

  await prisma.activity.createMany({
    data: [
      {
        type: ActivityType.BREATHING,
        title: "Morning breathing",
        subtitle: "Start your day with a calming breathing practice",
        videoUrl: "https://example.com/morning-breathing.mp4",
        breathingSlot: BreathingSlot.MORNING,
        orderIndex: 1,
        isActive: true,
      },
      {
        type: ActivityType.BREATHING,
        title: "Night breathing",
        subtitle: "Slow down and unwind before sleep",
        videoUrl: "https://example.com/night-breathing.mp4",
        breathingSlot: BreathingSlot.NIGHT,
        orderIndex: 2,
        isActive: true,
      },
      {
        type: ActivityType.WEEKLY,
        title: "Weekly Task",
        subtitle: "Preparing for overwhelming moments",
        videoUrl: "https://example.com/weekly-task.mp4",
        minPregnancyWeek: 1,
        maxPregnancyWeek: 40,
        orderIndex: 1,
        isActive: true,
      },
      {
        type: ActivityType.TEST_PREP,
        title: "Preparing for the second trimester scan",
        subtitle: "Weeks 19–22",
        videoUrl: "https://example.com/test-prep.mp4",
        minPregnancyWeek: 19,
        maxPregnancyWeek: 22,
        orderIndex: 1,
        isActive: true,
      },
    ],
  });

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
