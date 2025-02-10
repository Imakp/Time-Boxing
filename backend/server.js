const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

require('dotenv').config();
connectDB();

app.use(express.json({ extended: false }));
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/daily-tasks', require('./routes/dailyTasks'));
app.use('/api/important-tasks', require('./routes/importantTasks'));
app.use('/api/time-blocks', require('./routes/timeBlocks'));
app.use('/api', require('./routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 