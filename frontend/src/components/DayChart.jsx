import { useState } from "react";

const TimeColumn = ({ startHour, endHour }) => {
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  return (
    <div className="flex-1 relative h-[600px]">
      {hours.map((hour) => (
        <div key={hour} className="h-[50px] border-b dark:border-gray-700">
          <span className="text-xs text-slate-500 dark:text-gray-400">
            {hour.toString().padStart(2, "0")}:00
          </span>
        </div>
      ))}
    </div>
  );
};

export default function DayChart({
  tasks,
  allTasks,
  addTask,
  deleteTask,
  updateTask,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [newEntry, setNewEntry] = useState({
    task: null,
    startTime: "09:00",
    endTime: "10:00",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const handleAddEntry = () => {
    if (newEntry.task && newEntry.startTime && newEntry.endTime) {
      addTask({
        ...newEntry.task,
        startTime: newEntry.startTime,
        endTime: newEntry.endTime,
      });
      setShowPopup(false);
    }
  };

  const handleEditEntry = (updatedTask) => {
    const taskIndex = tasks.findIndex((t) => t.id === updatedTask.id);
    if (taskIndex > -1) {
      updateTask(taskIndex, updatedTask);
      setShowEditPopup(false);
    }
  };

  return (
    <div className="my-8 bg-slate-100 dark:bg-gray-900 p-6 rounded-xl shadow-sm border dark:border-gray-800 mr-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-200">
          Day Chart
        </h2>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <TimeColumn startHour={0} endHour={11} />
          <div className="absolute inset-0">
            {tasks.map((task, index) => {
              const startMinutes =
                task.startTime.split(":")[0] * 60 +
                Number(task.startTime.split(":")[1]);
              const endMinutes =
                task.endTime.split(":")[0] * 60 +
                Number(task.endTime.split(":")[1]);

              // For left column (0-11:59)
              if (startMinutes < 720) {
                // 720 minutes = 12 hours
                const columnEnd = Math.min(endMinutes, 720); // 12:00 in minutes
                const height = (columnEnd - startMinutes) * (600 / 720);

                return (
                  <div
                    key={index}
                    className="absolute w-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded p-1 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowEditPopup(true);
                    }}
                    style={{
                      top: `${startMinutes * (600 / 720)}px`,
                      height: `${height}px`,
                    }}
                  >
                    <span className="text-xs text-blue-600 dark:text-blue-300">
                      {task.text}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div className="relative">
          <TimeColumn startHour={12} endHour={23} />
          <div className="absolute inset-0">
            {tasks.map((task, index) => {
              const startMinutes =
                task.startTime.split(":")[0] * 60 +
                Number(task.startTime.split(":")[1]);
              const endMinutes =
                task.endTime.split(":")[0] * 60 +
                Number(task.endTime.split(":")[1]);

              // For right column (12:00-23:59)
              if (endMinutes > 720) {
                // 720 minutes = 12 hours
                const columnStart = Math.max(startMinutes, 720);
                const top = (columnStart - 720) * (600 / 720);
                const height = (endMinutes - columnStart) * (600 / 720);

                return (
                  <div
                    key={index}
                    className="absolute w-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded p-1 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowEditPopup(true);
                    }}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                    }}
                  >
                    <span className="text-xs text-blue-600 dark:text-blue-300">
                      {task.text}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-slate-100 dark:bg-gray-900 p-6 rounded-xl w-96 border dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200">
                Add Time Block
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Task
                </label>
                <select
                  className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-slate-800 dark:text-gray-200"
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      task: JSON.parse(e.target.value),
                    })
                  }
                >
                  <option value="">Select Task</option>
                  {allTasks
                    .filter((task) => !tasks.some((t) => t.id === task.id))
                    .map((task) => (
                      <option key={task.id} value={JSON.stringify(task)}>
                        {task.text}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newEntry.startTime}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, startTime: e.target.value })
                    }
                    className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-slate-800 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEntry.endTime}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, endTime: e.target.value })
                    }
                    className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-slate-800 dark:text-gray-200"
                  />
                </div>
              </div>

              <button
                onClick={handleAddEntry}
                className="w-full bg-slate-800 dark:bg-gray-700 text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-gray-600 transition-colors"
              >
                Add Time Block
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-slate-100 dark:bg-gray-900 p-6 rounded-xl w-96 border dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200">
                Edit Time Block
              </h3>
              <button
                onClick={() => setShowEditPopup(false)}
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Task
                </label>
                <select
                  className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-slate-800 dark:text-gray-200"
                  value={JSON.stringify(selectedTask.task)}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      task: JSON.parse(e.target.value),
                    })
                  }
                >
                  {allTasks
                    .filter(
                      (task) =>
                        task.id === selectedTask.id ||
                        !tasks.some((t) => t.id === task.id)
                    )
                    .map((task) => (
                      <option key={task.id} value={JSON.stringify(task)}>
                        {task.text}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={selectedTask.startTime}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-slate-800 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={selectedTask.endTime}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-slate-800 dark:text-gray-200"
                  />
                </div>
              </div>

              <button
                onClick={() => handleEditEntry(selectedTask)}
                className="w-full bg-slate-800 dark:bg-gray-700 text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-gray-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
