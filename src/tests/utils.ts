import { PrismaClient, Task } from "@prisma/client";

const prisma = new PrismaClient();

export const createTestTask = async (
  data: Partial<Task> = {},
): Promise<Task> => {
  return await prisma.task.create({
    data: {
      title: data.title || "Test Task",
      color: data.color || "#000000",
      status: data.status || "TODO",
    },
  });
};

