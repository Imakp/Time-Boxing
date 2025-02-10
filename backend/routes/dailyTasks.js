const express = require('express');
const router = express.Router();
const { 
  getDailyTasks,
  createDailyTask,
  deleteDailyTask
} = require('../controllers/dailyTasks');

router.route('/').get(getDailyTasks).post(createDailyTask);
router.route('/:id').delete(deleteDailyTask);

module.exports = router; 