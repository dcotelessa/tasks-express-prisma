import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();

beforeAll(async () => {
  // Push schema to test database
  execSync("dotenv -e .env.test -- npx prisma db push --force-reset");
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean all tables before each test
  await prisma.task.deleteMany({});
});

