import { z } from 'zod';
import { Status } from '@prisma/client';

// Base schema
export const taskSchema = {
  title: z.string().min(1, "Title is required"),
  color: z.string().min(1, "Color is required"),
  status: z.enum([Status.TODO, Status.PENDING, Status.COMPLETED], {
    errorMap: () => ({ message: "Invalid status value" })
  })
};

// Create task schema
export const createTaskSchema = z.object({
  title: taskSchema.title,
  color: taskSchema.color
});

// Update task schema
export const updateTaskSchema = z.object({
  title: taskSchema.title,
  color: taskSchema.color,
  status: taskSchema.status
});

// Types
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;