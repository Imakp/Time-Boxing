const API_URL = "http://localhost:3000/api/daily-tasks";

export const getDailyTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching daily tasks:", error);
    return [];
  }
};

export const createDailyTask = async (date) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    const result = await response.json();
    return result ? { ...result, _id: result._id } : null;
  } catch (error) {
    console.error("Error creating daily task:", error);
    return null;
  }
};

export const deleteDailyTask = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    return true;
  } catch (error) {
    console.error("Error deleting daily task:", error);
    return false;
  }
};
