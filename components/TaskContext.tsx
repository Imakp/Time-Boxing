"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

interface Task {
  id: string
  text: string
  status: "pending" | "completed"
}

interface AllocatedTask {
  id: string
  start: number // minutes from midnight
  duration: number // in minutes
}

interface TaskState {
  tasks: Task[]
  priorityTasks: string[]
  timeAllocations: Map<string, AllocatedTask[]>
}

type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_PRIORITY_TASK"; payload: { taskId: string; index: number } }
  | { type: "SET_TIME_ALLOCATION"; payload: { taskId: string; start: number; duration: number } }
  | { type: "UPDATE_TASK_DURATION"; payload: { taskId: string; duration: number } }

const initialState: TaskState = {
  tasks: [],
  priorityTasks: [],
  timeAllocations: new Map(),
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] }
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, status: task.status === "pending" ? "completed" : "pending" } : task,
        ),
      }
    case "DELETE_TASK": {
      const filteredAllocations = new Map(
        Array.from(state.timeAllocations.entries()).map(([time, tasks]) => [
          time,
          tasks.filter((task) => task.id !== action.payload),
        ]),
      )
      
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        priorityTasks: state.priorityTasks.filter((id) => id !== action.payload),
        timeAllocations: filteredAllocations,
      }
    }
    case "SET_PRIORITY_TASK":
      const newPriorityTasks = [...state.priorityTasks.filter(t => t !== action.payload.taskId)];
      newPriorityTasks[action.payload.index] = action.payload.taskId;
      return { 
        ...state, 
        priorityTasks: newPriorityTasks
          .slice(0, 3)
          .filter(t => t !== "")
      };
    case "SET_TIME_ALLOCATION": {
      const { taskId, start, duration } = action.payload;
      const newAllocations = new Map(state.timeAllocations);
      
      // Remove task from all time slots first
      Array.from(newAllocations.entries()).forEach(([timeKey, tasks]) => {
        newAllocations.set(timeKey, tasks.filter(t => t.id !== taskId));
      });

      const timeKey = start.toString();
      const existingTasks = newAllocations.get(timeKey) || [];
      newAllocations.set(timeKey, [...existingTasks, { id: taskId, start, duration }]);
      
      return { ...state, timeAllocations: newAllocations };
    }
    case "UPDATE_TASK_DURATION": {
      const modifiedAllocations = new Map(state.timeAllocations)
      for (const [time, tasks] of modifiedAllocations) {
        const taskIndex = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (taskIndex !== -1) {
          const updatedTasks = [...tasks]
          updatedTasks[taskIndex] = { 
            ...updatedTasks[taskIndex], 
            duration: action.payload.duration 
          }
          modifiedAllocations.set(time, updatedTasks)
          break
        }
      }
      return { ...state, timeAllocations: modifiedAllocations }
    }
    default:
      return state
  }
}

const TaskContext = createContext<
  | {
      state: TaskState
      dispatch: React.Dispatch<TaskAction>
    }
  | undefined
>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

