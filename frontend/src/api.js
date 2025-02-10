import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const tasksAPI = {
  getTasks: (date) => api.get('/tasks', { params: { date } }),
  createTask: (task) => api.post('/tasks', task),
  updateTask: (id, updates) => api.put(`/tasks/${id}`, updates),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

export const timeBlocksAPI = {
  getTimeBlocks: () => api.get('/time-blocks'),
  createTimeBlock: (block) => api.post('/time-blocks', block),
  updateTimeBlock: (id, updates) => api.put(`/time-blocks/${id}`, updates),
  deleteTimeBlock: (id) => api.delete(`/time-blocks/${id}`)
};

export const importantTasksAPI = {
  getImportantTasks: () => api.get('/important-tasks'),
  markAsImportant: (id) => api.post(`/important-tasks/${id}`),
  removeFromImportant: (id) => api.delete(`/important-tasks/${id}`)
};

export const dailyTasksAPI = {
  getDailyTasks: () => api.get('/daily-tasks'),
  createDailyTask: (date) => api.post('/daily-tasks', { date }),
  deleteDailyTask: (id) => api.delete(`/daily-tasks/${id}`)
}; 