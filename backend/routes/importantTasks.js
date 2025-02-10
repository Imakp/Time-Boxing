const express = require('express');
const router = express.Router();
const { 
  getImportantTasks,
  markAsImportant,
  removeFromImportant
} = require('../controllers/importantTasks');

router.route('/').get(getImportantTasks);
router.route('/:id').post(markAsImportant).delete(removeFromImportant);

module.exports = router; 