import DailyTask from "../models/DailyTask.js";
import Task from "../models/Task.js";

export const getImportantTasks = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const dailyTask = await DailyTask.findOne({ date })
      .populate("importantTasks")
      .lean();

    if (!dailyTask) {
      return res.json([]);
    }

    res.json(dailyTask.importantTasks || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addImportantTask = async (req, res) => {
  try {
    const { taskId, date } = req.body;

    let dailyTask = await DailyTask.findOne({ date });
    if (!dailyTask) {
      return res
        .status(404)
        .json({ message: "Daily task not found for this date" });
    }

    // Check if task already exists in important tasks
    if (dailyTask.importantTasks.includes(taskId)) {
      return res
        .status(400)
        .json({ message: "Task is already marked as important" });
    }

    // Check if we've reached the maximum limit
    if (dailyTask.importantTasks.length >= 3) {
      return res
        .status(400)
        .json({ message: "Maximum important tasks limit reached" });
    }

    dailyTask.importantTasks.push(taskId);
    await dailyTask.save();

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { important: true },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeImportantTask = async (req, res) => {
  try {
    const { taskId, date } = req.body;

    const dailyTask = await DailyTask.findOne({ date });
    if (!dailyTask) {
      return res.status(404).json({ message: "Daily task not found" });
    }

    dailyTask.importantTasks = dailyTask.importantTasks.filter(
      (id) => id.toString() !== taskId
    );
    await dailyTask.save();

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { important: false },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
