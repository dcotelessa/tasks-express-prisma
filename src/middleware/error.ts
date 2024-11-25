import { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import { ApiError } from "../types/tasks";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log all errors (dev only))
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }

  // Zod errors
  if (error instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: error.errors[0].message,
      code: 'VALIDATION_ERROR'
    });
    return;
  }

  // Custom API errors
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      code: 'API_ERROR'
    });
    return;
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        res.status(404).json({
          status: 'error',
          message: 'Record not found',
          code: 'NOT_FOUND'
        });
        break;
      case 'P2002':
        res.status(409).json({
          status: 'error',
          message: 'Resource already exists',
          code: 'DUPLICATE_ENTRY'
        });
        break;
      default:
        res.status(400).json({
          status: 'error',
          message: 'Database error',
          code: error.code
        });
    }
    return;
  }

  // Any other error
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    code: 'INTERNAL_SERVER_ERROR'
  });
}