export function persistPlanner(planner: any) {
  try {
    localStorage.setItem(`planner-${planner.id}`, JSON.stringify(planner))
  } catch (error) {
    console.error("Error saving planner:", error)
  }
}

export function loadPlanner(id: string) {
  try {
    const plannerData = localStorage.getItem(`planner-${id}`)
    return plannerData ? JSON.parse(plannerData) : null
  } catch (error) {
    console.error("Error loading planner:", error)
    return null
  }
}

export function handleStorageError(error: any) {
  console.error("Storage error:", error)
  // You can implement more sophisticated error handling here,
  // such as showing a user-friendly error message or attempting to use
  // an alternative storage method.
}

export function deletePlanner(id: string) {
  localStorage.removeItem(`planner-${id}`);
}

