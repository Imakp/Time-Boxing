import React, { useState } from "react";

export default function Sidebar({
  isOpen,
  setIsOpen,
  tasks,
  selectedDate,
  onDateSelect,
  addTask,
  deleteTask,
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleDeleteClick = (e, taskId) => {
    e.stopPropagation();
    setTaskToDelete(taskId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setShowConfirmDialog(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setTaskToDelete(null);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-slate-100 dark:bg-gray-900 w-64 border-r dark:border-gray-800 pt-16
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 
          transition-transform duration-300 
          z-40 lg:z-0`}
      >
        <div className="p-4 h-full flex flex-col">
          <button
            onClick={addTask}
            className="w-full bg-slate-800 dark:bg-gray-700 text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-gray-600 transition-colors"
          >
            New Task
          </button>

          <div className="mt-4 space-y-2 flex-1 overflow-y-auto pb-4 scrollbar-hide">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`flex justify-between items-center p-3 rounded-lg shadow-sm cursor-pointer transition-colors
                  ${
                    selectedDate === task.date
                      ? "bg-slate-200 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700"
                  }`}
                onClick={() => onDateSelect(task.date)}
              >
                <span
                  className={`${
                    selectedDate === task.date
                      ? "text-slate-700 dark:text-gray-200"
                      : "text-slate-500 dark:text-gray-400"
                  }`}
                >
                  {new Date(task.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <button
                  onClick={(e) => handleDeleteClick(e, task._id)}
                  className="text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200"
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
      </aside>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mb-4">
              Confirm Delete
            </h3>
            <p className="text-slate-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this daily task? This will also remove all tasks associated with this date.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
