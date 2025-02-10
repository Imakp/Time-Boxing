const Task = require('../models/Task');

const getTimeBlocks = async (req, res) => {
  try {
    const timeBlocks = await Task.find({ isTimeBlock: true });
    res.json(timeBlocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const isValidTimeRange = (start, end) => {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  return (endH > startH) || (endH === startH && endM > startM);
};

const createTimeBlock = async (req, res) => {
  const { text, date, startTime, endTime } = req.body;
  
  if (!isValidTimeRange(startTime, endTime)) {
    return res.status(400).json({ message: 'Invalid time range' });
  }

  try {
    const task = new Task({
      text,
      date: new Date(date),
      startTime,
      endTime,
      isTimeBlock: true
    });
    
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateTimeBlock = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, isTimeBlock: true },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteTimeBlock = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Time block deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTimeBlocks,
  createTimeBlock,
  updateTimeBlock,
  deleteTimeBlock
}; 