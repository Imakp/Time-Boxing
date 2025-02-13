import { useState } from "react";

export default function ImportantTasks({
  tasks = [],
  addTask,
  deleteTask,
  allTasks = []
}) {
  const [showPopup, setShowPopup] = useState(false);
  const availableTasks = allTasks.filter(
    (task) => !tasks.some((t) => t._id === task._id)
  );

  const canAddMore = tasks.length < 3;

  return (
    <div className="my-8 bg-slate-100 dark:bg-gray-900 p-6 rounded-xl shadow-sm border dark:border-gray-800 mr-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-200">
          Important Tasks
        </h2>
        {canAddMore && (
          <button
            onClick={() => setShowPopup(true)}
            className="text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm"
          >
            <span
              className={`${
                task.completed
                  ? "line-through text-slate-400 dark:text-gray-500"
                  : "text-slate-800 dark:text-gray-200"
              } break-words whitespace-normal flex-1 pr-2`}
            >
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task._id)}
              className="text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
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

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-slate-100 dark:bg-gray-900 p-6 rounded-xl w-96 border dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200">
                Select Task
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-slate-600 hover:text-slate-800 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <svg
                  className="w-5 h-5"
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
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
              {availableTasks.length > 0 ? (
                availableTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    <span
                      className={`${
                        task.completed
                          ? "line-through text-slate-400 dark:text-gray-500"
                          : "text-slate-800 dark:text-gray-200"
                      }`}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => {
                        addTask(task._id);
                        setShowPopup(false);
                      }}
                      className="bg-slate-800 dark:bg-gray-700 text-slate-100 dark:text-gray-200 px-3 py-1 rounded-lg hover:bg-slate-700 dark:hover:bg-gray-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-gray-400">
                  No tasks available
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
