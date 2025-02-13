const API_URL = "/api/important-tasks";

export const getImportantTasks = async (date) => {
  try {
    const response = await fetch(`${API_URL}?date=${date}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching important tasks:", error);
    return [];
  }
};

export const addImportantTask = async (taskId, date) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, date }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding important task:", error);
    throw error;
  }
};

export const removeImportantTask = async (taskId, date) => {
  try {
    const response = await fetch(`${API_URL}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, date }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error removing important task:", error);
    return null;
  }
};
