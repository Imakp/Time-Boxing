import Task from "../models/Task.js";
import DailyTask from "../models/DailyTask.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = new Task({
      text: req.body.text,
      completed: req.body.completed || false,
      date: req.body.date,
      isTimeBlock: req.body.isTimeBlock || false,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      important: req.body.important || false,
    });

    const newTask = await task.save();

    // Find the daily task for this date and add the task ID to its tasks array
    const dailyTask = await DailyTask.findOne({ date: req.body.date });
    if (dailyTask) {
      dailyTask.tasks.push(newTask._id);
      await dailyTask.save();
    }

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the daily task and remove the task ID from all arrays
    const dailyTask = await DailyTask.findOne({ date: task.date });
    if (dailyTask) {
      dailyTask.tasks = dailyTask.tasks.filter(
        (id) => id.toString() !== req.params.id
      );
      dailyTask.importantTasks = dailyTask.importantTasks.filter(
        (id) => id.toString() !== req.params.id
      );
      dailyTask.dayChartTasks = dailyTask.dayChartTasks.filter(
        (id) => id.toString() !== req.params.id
      );
      await dailyTask.save();
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
