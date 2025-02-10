const express = require('express');
const router = express.Router();
const { 
  getTimeBlocks,
  createTimeBlock,
  updateTimeBlock,
  deleteTimeBlock
} = require('../controllers/timeBlocks');

router.route('/').get(getTimeBlocks).post(createTimeBlock);
router.route('/:id').put(updateTimeBlock).delete(deleteTimeBlock);

module.exports = router; 