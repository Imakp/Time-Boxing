import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { v4 as uuidv4 } from "uuid";
import {
  getDailyTasks,
  createDailyTask,
  deleteDailyTask as deleteDailyTaskAPI,
} from "./services/dailyTaskService";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./services/taskService";
import {
  addImportantTask as addImportantTaskAPI,
  removeImportantTask as removeImportantTaskAPI,
} from "./services/importantTaskService";
import {
  addDayChartTask as addDayChartTaskAPI,
  removeDayChartTask as removeDayChartTaskAPI,
} from "./services/dayChartService";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [importantTasks, setImportantTasks] = useState([]);

  // Load daily tasks and all tasks
  useEffect(() => {
    const loadInitialData = async () => {
      const fetchedDailyTasks = await getDailyTasks();
      setDailyTasks(fetchedDailyTasks);

      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);

      // Set initial selected date to today if it exists in daily tasks
      const today = new Date().toISOString().split("T")[0];
      const todayTask = fetchedDailyTasks.find((task) => task.date === today);
      if (todayTask) {
        setSelectedDate(today);
      }
    };
    loadInitialData();
  }, []);

  const addDailyTask = async () => {
    const date = new Date().toISOString().split("T")[0];
    if (dailyTasks.some((task) => task.date === date)) {
      alert("Task for today already exists!");
      return;
    }

    try {
      const newTask = await createDailyTask(date);
      setDailyTasks((prev) => [...prev, newTask]);
      setSelectedDate(date);
    } catch (error) {
      alert("Failed to create daily task");
    }
  };

  const deleteDailyTask = async (taskId) => {
    const taskToDelete = dailyTasks.find((task) => task._id === taskId);
    if (!taskToDelete) return;

    const success = await deleteDailyTaskAPI(taskId);
    if (success) {
      // Remove the daily task
      setDailyTasks(dailyTasks.filter((task) => task._id !== taskId));

      // Remove all tasks associated with this date
      const taskDate = new Date(taskToDelete.date).toISOString().split("T")[0];
      setTasks((prevTasks) =>
        prevTasks.filter((task) => {
          const currentTaskDate = new Date(task.date)
            .toISOString()
            .split("T")[0];
          return currentTaskDate !== taskDate;
        })
      );

      // Reset selected date if it was the deleted date
      if (selectedDate === taskDate) {
        setSelectedDate(null);
      }
    }
  };

  const addAllTask = async (taskData) => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    const newTask = await createTask({
      ...taskData,
      date: selectedDate,
    });

    if (newTask) {
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const deleteAllTask = async (taskId) => {
    const success = await deleteTask(taskId);
    if (success) {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    }
  };

  const updateAllTask = async (taskId, updates) => {
    const updatedTask = await updateTask(taskId, updates);
    if (updatedTask) {
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Filter tasks for the selected date
  const currentDateTasks = selectedDate
    ? tasks.filter((task) => {
        if (!task.date) return false;
        const taskDate = new Date(task.date).toISOString().split("T")[0];
        return taskDate === selectedDate;
      })
    : [];

  // Filter important tasks for the selected date
  const currentImportantTasks = selectedDate
    ? currentDateTasks.filter((task) => task.important)
    : [];

  const handleAddImportantTask = async (taskId) => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    try {
      const updatedTask = await addImportantTaskAPI(taskId, selectedDate);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteImportantTask = async (taskId) => {
    try {
      const updatedTask = await removeImportantTaskAPI(taskId, selectedDate);
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? updatedTask : t))
        );
      }
    } catch (error) {
      alert("Failed to remove important task");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleAddDayChartTask = async (taskId, startTime, endTime) => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    // Find the existing task
    const existingTask = tasks.find((t) => t._id === taskId);
    if (!existingTask) {
      alert("Task not found");
      return;
    }

    if (existingTask.isTimeBlock) {
      alert("Task is already in day chart");
      return;
    }

    try {
      const updatedTask = await addDayChartTaskAPI(
        taskId,
        selectedDate,
        startTime,
        endTime
      );
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, ...updatedTask } : t))
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemoveDayChartTask = async (taskId) => {
    try {
      const updatedTask = await removeDayChartTaskAPI(taskId, selectedDate);
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? updatedTask : t))
        );
      }
    } catch (error) {
      alert("Failed to remove day chart task");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } bg-white dark:bg-gray-950`}
    >
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        tasks={dailyTasks}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        addTask={addDailyTask}
        deleteTask={deleteDailyTask}
      />
      <MainContent
        isSidebarOpen={isSidebarOpen}
        tasks={currentDateTasks}
        addTask={addAllTask}
        deleteTask={deleteAllTask}
        updateTask={updateAllTask}
        selectedDate={selectedDate}
        importantTasks={currentImportantTasks}
        addImportantTask={handleAddImportantTask}
        deleteImportantTask={handleDeleteImportantTask}
        addDayChartTask={handleAddDayChartTask}
        removeDayChartTask={handleRemoveDayChartTask}
      />
    </div>
  );
}

export default App;
