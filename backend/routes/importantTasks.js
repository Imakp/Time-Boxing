import express from "express";
import {
  getImportantTasks,
  addImportantTask,
  removeImportantTask,
} from "../controllers/importantTaskController.js";

const router = express.Router();

router.get("/", getImportantTasks);
router.post("/add", addImportantTask);
router.post("/remove", removeImportantTask);

export default router;
