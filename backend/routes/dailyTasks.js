import express from "express";
import {
  getDailyTasks,
  createDailyTask,
  deleteDailyTask,
} from "../controllers/dailyTaskController.js";

const router = express.Router();

router.get("/", getDailyTasks);
router.post("/", createDailyTask);
router.delete("/:id", deleteDailyTask);

export default router;
