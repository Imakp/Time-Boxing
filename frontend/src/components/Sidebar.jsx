export default function Sidebar({
  isOpen,
  setIsOpen,
  tasks,
  selectedDate,
  onDateSelect,
  addTask,
  deleteTask,
}) {
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
                  {new Date(task.date).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task._id);
                  }}
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
    </>
  );
}
