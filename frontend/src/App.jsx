import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { v4 as uuidv4 } from 'uuid';
import { getDailyTasks, createDailyTask, deleteDailyTask as deleteDailyTaskAPI } from './services/dailyTaskService';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [tasksByDate, setTasksByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadDailyTasks = async () => {
      const tasks = await getDailyTasks();
      setDailyTasks(tasks);
    };
    loadDailyTasks();
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
    const success = await deleteDailyTaskAPI(taskId);
    if (success) {
      setDailyTasks(dailyTasks.filter((task) => task._id !== taskId));
      if (selectedDate === taskToDelete.date) {
        setSelectedDate(null);
      }
    }
  };

  const addAllTask = (task) => {
    setTasksByDate((prev) => {
      const dateTasks = prev[selectedDate] || {
        allTasks: [],
        importantTasks: [],
        dayChartTasks: [],
      };

      const existingTask = dateTasks.allTasks.find((t) => t.id === task.id);

      return {
        ...prev,
        [selectedDate]: {
          ...dateTasks,
          allTasks: existingTask
            ? dateTasks.allTasks.map((t) =>
                t.id === task.id ? { ...t, ...task } : t
              )
            : [...dateTasks.allTasks, task],
        },
      };
    });
  };

  const deleteAllTask = (taskId) => {
    if (!selectedDate) return;

    setTasksByDate((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        allTasks: prev[selectedDate].allTasks.filter((t) => t.id !== taskId),
        importantTasks: prev[selectedDate].importantTasks.filter(
          (t) => t.id !== taskId
        ),
        dayChartTasks: prev[selectedDate].dayChartTasks.filter(
          (t) => t.id !== taskId
        ),
      },
    }));
  };

  const updateAllTask = (taskId, updates) => {
    if (!selectedDate) return;

    setTasksByDate((prev) => {
      const dateTasks = prev[selectedDate];
      if (!dateTasks) return prev;
      const updatedAllTasks = dateTasks.allTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      const updatedImportantTasks = dateTasks.importantTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      const updatedDayChartTasks = dateTasks.dayChartTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      );

      return {
        ...prev,
        [selectedDate]: {
          ...dateTasks,
          allTasks: updatedAllTasks,
          importantTasks: updatedImportantTasks,
          dayChartTasks: updatedDayChartTasks,
        },
      };
    });
  };

  const addImportantTask = (taskId) => {
    if (!selectedDate) return;

    setTasksByDate((prev) => {
      const dateTasks = prev[selectedDate] || {
        allTasks: [],
        importantTasks: [],
        dayChartTasks: [],
      };

      const taskToAdd = dateTasks.allTasks.find((t) => t.id === taskId);
      const isAlreadyImportant = dateTasks.importantTasks.some(
        (t) => t.id === taskId
      );

      if (
        dateTasks.importantTasks.length < 3 &&
        taskToAdd &&
        !isAlreadyImportant
      ) {
        return {
          ...prev,
          [selectedDate]: {
            ...dateTasks,
            importantTasks: [...dateTasks.importantTasks, taskToAdd],
          },
        };
      }
      return prev;
    });
  };

  const deleteImportantTask = (taskId) => {
    if (!selectedDate) return;

    setTasksByDate((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        importantTasks: prev[selectedDate].importantTasks.filter(
          (t) => t.id !== taskId
        ),
      },
    }));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const currentTasks = selectedDate
    ? tasksByDate[selectedDate] || {
        allTasks: [],
        importantTasks: [],
        dayChartTasks: [],
      }
    : {
        allTasks: [],
        importantTasks: [],
        dayChartTasks: [],
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
        tasks={currentTasks.allTasks}
        addTask={addAllTask}
        deleteTask={deleteAllTask}
        updateTask={updateAllTask}
        importantTasks={currentTasks.importantTasks}
        addImportantTask={addImportantTask}
        deleteImportantTask={deleteImportantTask}
      />
    </div>
  );
}

export default App;
