import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { v4 as uuidv4 } from 'uuid';
import { tasksAPI, timeBlocksAPI, importantTasksAPI, dailyTasksAPI } from './api';

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
    const fetchData = async () => {
      try {
        const [tasksRes, importantRes, timeBlocksRes] = await Promise.all([
          tasksAPI.getTasks(selectedDate),
          importantTasksAPI.getImportantTasks(),
          timeBlocksAPI.getTimeBlocks()
        ]);
        
        setTasksByDate(prev => ({
          ...prev,
          [selectedDate]: {
            allTasks: tasksRes.data,
            importantTasks: importantRes.data,
            dayChartTasks: timeBlocksRes.data
          }
        }));
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    
    if (selectedDate) fetchData();
  }, [selectedDate]);

  const addDailyTask = () => {
    const date = new Date().toISOString().split("T")[0];

    if (dailyTasks.some((task) => task.date === date)) {
      alert("Task for today already exists!");
      return;
    }

    const newTask = { id: uuidv4(), date };
    setDailyTasks((prev) => [...prev, newTask]);
    setSelectedDate(date);

    setTasksByDate((prev) => ({
      ...prev,
      [date]: prev[date] || {
        allTasks: [],
        importantTasks: [],
        dayChartTasks: [],
      },
    }));
  };

  const deleteDailyTask = (taskId) => {
    const taskToDelete = dailyTasks.find((task) => task.id === taskId);
    if (!taskToDelete) return;

    setDailyTasks(dailyTasks.filter((task) => task.id !== taskId));
    
    const updatedTasksByDate = { ...tasksByDate };
    delete updatedTasksByDate[taskToDelete.date];
    setTasksByDate(updatedTasksByDate);

    if (selectedDate === taskToDelete.date) {
      setSelectedDate(null);
    }
  };

  const addAllTask = async (task) => {
    try {
      if (!selectedDate) {
        alert("Please create a daily task first!");
        return;
      }
      
      const taskWithDate = { ...task, date: selectedDate };
      let response;
      
      if (task.isTimeBlock) {
        response = await timeBlocksAPI.createTimeBlock(taskWithDate);
      } else {
        response = await tasksAPI.createTask(taskWithDate);
      }
      
      setTasksByDate(prev => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          allTasks: [...(prev[selectedDate]?.allTasks || []), response.data]
        }
      }));
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const deleteAllTask = async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      setTasksByDate(prev => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          allTasks: prev[selectedDate].allTasks.filter(t => t._id !== taskId)
        }
      }));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const updateAllTask = async (taskId, updates) => {
    try {
      const response = await tasksAPI.updateTask(taskId, updates);
      setTasksByDate(prev => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          allTasks: prev[selectedDate].allTasks.map(t => 
            t._id === taskId ? response.data : t
          )
        }
      }));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
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
