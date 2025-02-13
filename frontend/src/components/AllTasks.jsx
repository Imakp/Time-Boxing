import { useState } from "react";

export default function AllTasks({ tasks, addTask, deleteTask, updateTask }) {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    
    const taskData = {
      text: newTask,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    };
    
    await addTask(taskData);
    setNewTask("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex gap-2 items-start bg-white dark:bg-gray-800 p-2 md:p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() =>
                updateTask(task._id, { completed: !task.completed })
              }
              className="flex-shrink-0 text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-gray-100 mt-1"
            >
              {task.completed ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="8" />
                </svg>
              ) : (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <textarea
                value={task.text}
                onChange={(e) => updateTask(task._id, { text: e.target.value })}
                className={`w-full bg-transparent text-sm md:text-base resize-none ${
                  task.completed
                    ? "line-through text-slate-400 dark:text-gray-500"
                    : "text-slate-800 dark:text-gray-200"
                } focus:outline-none`}
                style={{
                  height: "auto",
                  minHeight: "24px",
                  overflow: "hidden",
                }}
                ref={(el) => {
                  if (el) {
                    el.style.height = "0px";
                    el.style.height = el.scrollHeight + "px";
                  }
                }}
                onInput={(e) => {
                  e.target.style.height = "0px";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
            </div>
            <button
              onClick={() => deleteTask(task._id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors mt-1"
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
