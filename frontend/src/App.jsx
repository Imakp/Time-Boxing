// App.jsx
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dailyTasks, setDailyTasks] = useState([]);
  // Store tasks by date
  const [tasksByDate, setTasksByDate] = useState({});
  // Track currently selected date
  const [selectedDate, setSelectedDate] = useState(null);

  // Add responsive behavior
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

  const addDailyTask = () => {
    const date = new Date().toISOString().split("T")[0];
    
    if (dailyTasks.some(task => task.date === date)) {
      alert('Task for today already exists!');
      return;
    }

    const newTask = { id: Date.now(), date };
    setDailyTasks(prev => [...prev, newTask]);
    setSelectedDate(date);
    
    setTasksByDate(prev => ({
      ...prev,
      [date]: prev[date] || { 
        allTasks: [], 
        importantTasks: [], 
        dayChartTasks: [] 
      }
    }));
  };

  const deleteDailyTask = (index) => {
    const taskToDelete = dailyTasks[index];
    setDailyTasks(dailyTasks.filter((_, i) => i !== index));

    // Remove all associated tasks for that date
    const updatedTasksByDate = { ...tasksByDate };
    delete updatedTasksByDate[taskToDelete.date];
    setTasksByDate(updatedTasksByDate);

    // Clear selected date if it was selected
    if (selectedDate === taskToDelete.date) {
      setSelectedDate(null);
    }
  };

  const addAllTask = (task) => {
    setTasksByDate(prev => {
      const dateTasks = prev[selectedDate] || { 
        allTasks: [], 
        importantTasks: [], 
        dayChartTasks: [] 
      };
      
      // Check if task already exists
      const existingTask = dateTasks.allTasks.find(t => t.id === task.id);
      
      return {
        ...prev,
        [selectedDate]: {
          ...dateTasks,
          allTasks: existingTask
            ? dateTasks.allTasks.map(t => t.id === task.id ? {...t, ...task} : t)
            : [...dateTasks.allTasks, task]
        }
      };
    });
  };

  const deleteAllTask = (index) => {
    if (!selectedDate) return;

    setTasksByDate({
      ...tasksByDate,
      [selectedDate]: {
        ...tasksByDate[selectedDate],
        allTasks: tasksByDate[selectedDate].allTasks.filter(
          (_, i) => i !== index
        ),
      },
    });
  };

  const updateAllTask = (index, newText) => {
    if (!selectedDate) return;

    setTasksByDate({
      ...tasksByDate,
      [selectedDate]: {
        ...tasksByDate[selectedDate],
        allTasks: tasksByDate[selectedDate].allTasks.map((task, i) =>
          i === index ? { ...task, text: newText } : task
        ),
      },
    });
  };

  const addImportantTask = (task) => {
    if (!selectedDate) return;

    const currentImportantTasks = tasksByDate[selectedDate].importantTasks;
    if (
      currentImportantTasks.length < 3 &&
      !currentImportantTasks.some((t) => t.id === task.id)
    ) {
      setTasksByDate({
        ...tasksByDate,
        [selectedDate]: {
          ...tasksByDate[selectedDate],
          importantTasks: [...currentImportantTasks, task],
        },
      });
    }
  };

  const deleteImportantTask = (index) => {
    if (!selectedDate) return;

    setTasksByDate({
      ...tasksByDate,
      [selectedDate]: {
        ...tasksByDate[selectedDate],
        importantTasks: tasksByDate[selectedDate].importantTasks.filter(
          (_, i) => i !== index
        ),
      },
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Get current day's tasks or empty arrays if none exist
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
