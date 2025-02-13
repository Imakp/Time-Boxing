import DailyTask from '../models/DailyTask.js';
import Task from '../models/Task.js';

export const getDayChartTasks = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const dailyTask = await DailyTask.findOne({ date })
      .populate('dayChartTasks')
      .lean();

    if (!dailyTask) {
      return res.json([]);
    }

    res.json(dailyTask.dayChartTasks || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDayChartTask = async (req, res) => {
  try {
    const { taskId, date, startTime, endTime } = req.body;
    
    let dailyTask = await DailyTask.findOne({ date });
    if (!dailyTask) {
      return res.status(404).json({ message: 'Daily task not found for this date' });
    }

    // Check if task exists
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task already exists in day chart tasks
    if (dailyTask.dayChartTasks.includes(taskId)) {
      return res.status(400).json({ message: 'Task is already in day chart' });
    }

    // Validate time slots
    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Start and end time are required' });
    }

    // Update existing task instead of creating a new one
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { 
        isTimeBlock: true,
        startTime,
        endTime
      },
      { new: true }
    );

    // Add to dayChartTasks only if not already present
    if (!dailyTask.dayChartTasks.includes(taskId)) {
      dailyTask.dayChartTasks.push(taskId);
      await dailyTask.save();
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeDayChartTask = async (req, res) => {
  try {
    const { taskId, date } = req.body;
    
    const dailyTask = await DailyTask.findOne({ date });
    if (!dailyTask) {
      return res.status(404).json({ message: 'Daily task not found' });
    }

    dailyTask.dayChartTasks = dailyTask.dayChartTasks.filter(
      id => id.toString() !== taskId
    );
    await dailyTask.save();

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { 
        isTimeBlock: false,
        startTime: null,
        endTime: null
      },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 