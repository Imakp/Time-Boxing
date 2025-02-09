import ImportantTasks from "./ImportantTasks";
import AllTasks from "./AllTasks";
import DayChart from "./DayChart";

export default function MainContent({
  isSidebarOpen,
  tasks,
  addTask,
  deleteTask,
  updateTask,
  importantTasks,
  addImportantTask,
  deleteImportantTask,
}) {
  return (
    <div
      className={`pl-4 pt-16 overflow-hidden transition-margin duration-300
        ${isSidebarOpen ? "lg:ml-64" : "ml-0"}
        ml-0  // Default margin for mobile
      `}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <div className="col-span-1 space-y-4">
          <ImportantTasks
            tasks={importantTasks}
            addTask={addImportantTask}
            deleteTask={deleteImportantTask}
            allTasks={tasks}
          />
          <AllTasks
            tasks={tasks}
            addTask={addTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <DayChart
            tasks={tasks.filter((t) => t.startTime && t.endTime)}
            allTasks={tasks}
            addTask={addTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        </div>
      </div>
    </div>
  );
}
