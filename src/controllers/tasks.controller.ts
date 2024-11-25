import { RequestHandler } from "express";
import { PrismaClient, Status } from "@prisma/client";
import { TaskParams } from "../types/tasks";
import { CreateTaskSchema, UpdateTaskSchema } from '../schemas/task.schema';

const prisma = new PrismaClient();

export const createTask: RequestHandler<{}, any, CreateTaskSchema> = async (
  req,
  res,
  next
) => {
  try {
    const { title, color } = req.body;
    
    const task = await prisma.task.create({
      data: {
        title,
        color,
        status: Status.TODO,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const findAllTasks: RequestHandler = async (
  _,
  res,
  next
) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask: RequestHandler<TaskParams, any, UpdateTaskSchema> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { title, color, status } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { title, color, status }
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask: RequestHandler<TaskParams> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};