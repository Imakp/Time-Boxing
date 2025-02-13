import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  isTimeBlock: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: String,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      }
    }
  },
  endTime: {
    type: String,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      }
    }
  },
  important: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.index({ date: 1, important: 1 });
taskSchema.index({ isTimeBlock: 1, startTime: 1 });

// Validation for time blocks
taskSchema.pre('validate', function(next) {
  if (this.isTimeBlock) {
    if (!this.startTime || !this.endTime) {
      this.invalidate('time', 'Time blocks require start and end times');
    }
    
    const start = parseInt(this.startTime.replace(':', ''));
    const end = parseInt(this.endTime.replace(':', ''));
    
    if (start >= end) {
      this.invalidate('time', 'End time must be after start time');
    }
    
    if ((end - start) < 15) {
      this.invalidate('time', 'Minimum time block is 15 minutes');
    }
  }
  next();
});

export default mongoose.model('Task', taskSchema); 