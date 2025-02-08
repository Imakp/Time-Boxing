import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [dailyTasks, setDailyTasks] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [importantTasks, setImportantTasks] = useState([])

  // Add responsive behavior
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true) // Keep sidebar open on larger screens
    }
  }

  // Initial check
  handleResize()

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

  // Rest of the state management code remains the same
  const addDailyTask = () => {
    setDailyTasks([...dailyTasks, { id: Date.now(), text: `Task ${dailyTasks.length + 1}`, date: new Date().toISOString().split('T')[0] }])
  }

  const deleteDailyTask = (index) => {
    setDailyTasks(dailyTasks.filter((_, i) => i !== index))
  }

  const addAllTask = (task) => {
    setAllTasks([...allTasks, task])
  }

  const deleteAllTask = (index) => {
    setAllTasks(allTasks.filter((_, i) => i !== index))
  }

  const updateAllTask = (index, newText) => {
    setAllTasks(allTasks.map((task, i) => 
      i === index ? { ...task, text: newText } : task
    ))
  }

  const addImportantTask = (task) => {
    if (importantTasks.length < 3 && !importantTasks.some(t => t.id === task.id)) {
      setImportantTasks([...importantTasks, task])
    }
  }

  const deleteImportantTask = (index) => {
    setImportantTasks(importantTasks.filter((_, i) => i !== index))
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-white dark:bg-gray-950`}>
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
        addTask={addDailyTask}
        deleteTask={deleteDailyTask}
      />
      <MainContent 
        isSidebarOpen={isSidebarOpen}
        tasks={allTasks}
        addTask={addAllTask}
        deleteTask={deleteAllTask}
        updateTask={updateAllTask}
        importantTasks={importantTasks}
        addImportantTask={addImportantTask}
        deleteImportantTask={deleteImportantTask}
      />
    </div>
  )
}

export default App