"use client"

import type React from "react"
import { useTaskContext } from "./TaskContext"
import { Card, CardContent } from "@/components/ui/card"

interface PriorityTasksProps {
  tasks: string[]
}

export default function PriorityTasks({ tasks }: PriorityTasksProps) {
  const { state, dispatch } = useTaskContext()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("text/plain")
    if (tasks.includes(taskId)) return
    dispatch({ type: "SET_PRIORITY_TASK", payload: { taskId, index } })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[0, 1, 2].map((index) => (
        <Card key={index}>
          <CardContent
            className="p-4 min-h-[100px] flex items-center justify-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
          >
            {tasks[index] ? (
              <div>{state.tasks.find((t) => t.id === tasks[index])?.text}</div>
            ) : (
              <div className="text-muted-foreground">Drag task here</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

