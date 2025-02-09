import { useState } from "react";

export default function AllTasks({ tasks, addTask, deleteTask, updateTask }) {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask({ id: Date.now(), text: newTask });
      setNewTask("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="w-[calc(100%-1rem)] bg-slate-100 dark:bg-gray-900 p-4 md:p-6 rounded-xl shadow-sm border dark:border-gray-800 flex flex-col h-[408px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-gray-200">
          All Tasks
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 w-full bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm md:text-base text-slate-800 dark:text-gray-200 border border-transparent focus:border-slate-300 dark:focus:border-gray-600"
          placeholder="Add new task"
        />
        <button
          onClick={handleAddTask}
          className="w-full sm:w-auto bg-slate-800 dark:bg-gray-700 text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-gray-600 transition-colors text-sm md:text-base"
        >
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-2 scrollbar-hide">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="flex gap-2 items-center bg-white dark:bg-gray-800 p-2 md:p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <input
              type="text"
              value={task.text}
              onChange={(e) => updateTask(index, e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-sm md:text-base text-slate-800 dark:text-gray-200 focus:outline-none"
            />
            <button
              onClick={() => deleteTask(task.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Delete task"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
