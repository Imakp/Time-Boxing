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
  selectedDate,
  addDayChartTask,
  removeDayChartTask,
}) {
  return (
    <main
      className={`flex-1 pl-4 pt-16 overflow-hidden
        ${isSidebarOpen ? "lg:ml-64" : "ml-0"}
        transition-all duration-300 ease-in-out`}
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
            selectedDate={selectedDate}
          />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <DayChart
            tasks={tasks.filter(
              (t) =>
                t.isTimeBlock &&
                new Date(t.date).toISOString().split("T")[0] === selectedDate
            )}
            allTasks={tasks.filter(
              (t) =>
                new Date(t.date).toISOString().split("T")[0] === selectedDate &&
                !t.isTimeBlock
            )}
            addTask={addDayChartTask}
            deleteTask={removeDayChartTask}
            updateTask={updateTask}
          />
        </div>
      </div>
    </main>
  );
}
