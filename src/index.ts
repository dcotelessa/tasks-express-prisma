import express, { Express } from "express";
import cors from 'cors';
import taskRoutes from "./routes/tasks.routes";
import { errorHandler } from "./middleware/error";


const app: Express = express();

// Add CORS middleware
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);

// Error handling - must be last
app.use(errorHandler);

// Only start the server if this file is run directly (not in test environment)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (error: Error) => {
    console.error("Unhandled Rejection:", error);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error: Error) => {
    console.error("Uncaught Exception:", error);
    server.close(() => {
      process.exit(1);
    });
  });
}

export { app };