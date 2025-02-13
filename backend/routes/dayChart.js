import express from "express";
import {
  getDayChartTasks,
  addDayChartTask,
  removeDayChartTask,
} from "../controllers/dayChartController.js";

const router = express.Router();

router.get("/", getDayChartTasks);
router.post("/add", addDayChartTask);
router.post("/remove", removeDayChartTask);

export default router;
