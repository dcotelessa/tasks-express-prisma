import { Status } from "@prisma/client";
import { ParamsDictionary } from 'express-serve-static-core';

export interface Task {
  id: string;
  title: string;
  color: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskParams extends ParamsDictionary {
  id: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
