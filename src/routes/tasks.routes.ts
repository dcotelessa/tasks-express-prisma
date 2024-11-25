import { Router } from "express";
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';
import { createTask, findAllTasks, updateTask, deleteTask } from "../controllers/tasks.controller";

const router = Router();

router.post('/', validate(createTaskSchema), createTask);
router.get("/", findAllTasks);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;