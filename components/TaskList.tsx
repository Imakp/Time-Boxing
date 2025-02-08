"use client"

import { useState } from "react"
import { useTaskContext } from "./TaskContext"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  text: string
  status: "pending" | "completed"
}

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  const { dispatch } = useTaskContext()
  const [newTask, setNewTask] = useState("")

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch({
        type: "ADD_TASK",
        payload: {
          id: Date.now().toString(),
          text: newTask,
          status: "pending",
        },
      })
      setNewTask("")
    }
  }

  const handleToggleTask = (taskId: string) => {
    dispatch({ type: "TOGGLE_TASK", payload: taskId })
  }

  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: "DELETE_TASK", payload: taskId })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 sticky top-0 bg-background z-10 pb-2">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
          className="h-8 text-sm"
        />
        <Button className="h-8 px-3 text-sm" onClick={handleAddTask}>Add</Button>
      </div>
      <ul className="space-y-1.5 pb-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 group"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
          >
            <Checkbox 
              checked={task.status === "completed"} 
              onCheckedChange={() => handleToggleTask(task.id)}
              className="h-4 w-4"
            />
            <span className={cn("text-sm flex-1", task.status === "completed" && "line-through text-muted-foreground")}>
              {task.text}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDeleteTask(task.id)}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

