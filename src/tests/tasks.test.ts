import request from "supertest";
import { app } from "../index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
describe("Database cleanup", () => {
  it("should start with an empty database", async () => {
    const tasks = await prisma.task.findMany();
    expect(tasks).toHaveLength(0);
  });

  it("should still be empty even after other tests run", async () => {
    // First create a task
    await prisma.task.create({
      data: {
        title: "Test Task",
        color: "#000000",
      },
    });

    // Verify it was created
    let tasks = await prisma.task.findMany();
    expect(tasks).toHaveLength(1);
  });

  it("should start empty in the next test", async () => {
    const tasks = await prisma.task.findMany();
    expect(tasks).toHaveLength(0);
  });
});

describe("Tasks API", () => {
  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Test Task",
        color: "#000000",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Test Task");
      expect(response.body.color).toBe("#000000");
      expect(response.body.status).toBe("TODO");
    });

    it("should return validation error for missing fields", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Test Task",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("status", "error");
    });
  });

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      // Create test tasks
      await prisma.task.createMany({
        data: [
          { title: "Task 1", color: "#000000" },
          { title: "Task 2", color: "#ffffff" },
        ],
      });

      const response = await request(app).get("/tasks");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(2);
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update a task", async () => {
      // Create a test task
      const task = await prisma.task.create({
        data: {
          title: "Original Task",
          color: "#000000",
        },
      });

      const response = await request(app).put(`/tasks/${task.id}`).send({
        title: "Updated Task",
        color: "#ffffff",
        status: "COMPLETED",
      });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Task");
      expect(response.body.status).toBe("COMPLETED");
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app).put("/tasks/non-existent-id").send({
        title: "Updated Task",
        color: "#ffffff",
        status: "COMPLETED",
      });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", async () => {
      // Create a test task
      const task = await prisma.task.create({
        data: {
          title: "Task to Delete",
          color: "#000000",
        },
      });

      const response = await request(app).delete(`/tasks/${task.id}`);

      expect(response.status).toBe(204);

      // Verify task is deleted
      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id },
      });
      expect(deletedTask).toBeNull();
    });
  });
});

