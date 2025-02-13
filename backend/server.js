import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import indexRouter from "./routes/index.js";
import dailyTasksRouter from "./routes/dailyTasks.js";
import tasksRouter from "./routes/tasks.js";
import importantTasksRouter from "./routes/importantTasks.js";
import dayChartRouter from "./routes/dayChart.js";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();

app.use(express.json({ extended: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/daily-tasks", dailyTasksRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/important-tasks", importantTasksRouter);
app.use("/api/day-chart", dayChartRouter);
app.use("/api", indexRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
