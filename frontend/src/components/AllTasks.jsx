import { useState } from "react";

export default function AllTasks({ tasks, addTask, deleteTask, updateTask }) {
  const [newTask, setNewTask] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editingText, setEditingText] = useState({});

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const taskData = {
      text: newTask,
      completed: false,
      date: new Date().toISOString().split("T")[0],
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

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setShowDeleteDialog(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setTaskToDelete(null);
  };

  const handleUpdateTask = (taskId, updates) => {
    if ('completed' in updates) {
      updateTask(taskId, updates);
      return;
    }

    if ('text' in updates) {
      setEditingText(prev => ({
        ...prev,
        [taskId]: updates.text
      }));
    }
  };

  const handleTextBlur = (taskId) => {
    const newText = editingText[taskId];
    if (newText !== undefined && newText !== tasks.find(t => t._id === taskId)?.text) {
      setPendingUpdate({ taskId, updates: { text: newText } });
      setShowConfirmDialog(true);
    }
    setEditingText(prev => {
      const newState = { ...prev };
      delete newState[taskId];
      return newState;
    });
  };

  const confirmUpdate = async () => {
    if (pendingUpdate) {
      await updateTask(pendingUpdate.taskId, pendingUpdate.updates);
      setShowConfirmDialog(false);
      setPendingUpdate(null);
    }
  };

  const cancelUpdate = () => {
    if (pendingUpdate && 'text' in pendingUpdate.updates) {
      setEditingText(prev => {
        const newState = { ...prev };
        delete newState[pendingUpdate.taskId];
        return newState;
      });
    }
    setShowConfirmDialog(false);
    setPendingUpdate(null);
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
                handleUpdateTask(task._id, { completed: !task.completed })
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
                value={editingText[task._id] !== undefined ? editingText[task._id] : task.text}
                onChange={(e) =>
                  handleUpdateTask(task._id, { text: e.target.value })
                }
                onBlur={() => handleTextBlur(task._id)}
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
              onClick={() => handleDeleteClick(task._id)}
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

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mb-4">
              Confirm Update
            </h3>
            <p className="text-slate-600 dark:text-gray-400 mb-6">
              Are you sure you want to update this task?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelUpdate}
                className="px-4 py-2 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-slate-800 dark:bg-gray-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-gray-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mb-4">
              Confirm Delete
            </h3>
            <p className="text-slate-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this task?
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
    </div>
  );
}
