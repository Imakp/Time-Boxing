import mongoose from "mongoose";

const dailyTaskSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    validate: {
      validator: (v) => !isNaN(new Date(v).valueOf()),
      message: "Invalid date format",
    },
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  importantTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  dayChartTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent more than 3 important tasks
dailyTaskSchema.pre("save", function (next) {
  if (this.importantTasks.length > 3) {
    return next(new Error("Maximum of 3 important tasks allowed"));
  }
  next();
});

export default mongoose.model("DailyTask", dailyTaskSchema);
