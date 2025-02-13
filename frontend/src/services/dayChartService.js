const API_URL = "http://localhost:3000/api/day-chart";

export const getDayChartTasks = async (date) => {
  try {
    const response = await fetch(`${API_URL}?date=${date}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching day chart tasks:", error);
    return [];
  }
};

export const addDayChartTask = async (taskId, date, startTime, endTime) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, date, startTime, endTime }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding day chart task:", error);
    throw error;
  }
};

export const removeDayChartTask = async (taskId, date) => {
  try {
    const response = await fetch(`${API_URL}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, date }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error removing day chart task:", error);
    return null;
  }
};
