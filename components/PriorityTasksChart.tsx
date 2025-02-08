"use client"

import type React from "react"
import { useState } from "react"
import { useTaskContext } from "./TaskContext"
import { Card, CardContent } from "@/components/ui/card"

interface PriorityTasksChartProps {
  allocations: Map<string, AllocatedTask[]>
}

interface AllocatedTask {
  id: string
}

export default function PriorityTasksChart({ allocations }: PriorityTasksChartProps) {
  const { state, dispatch } = useTaskContext()
  const [draggingTask, setDraggingTask] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggingTask(taskId)
    e.dataTransfer.setData("text/plain", taskId)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("text/plain")
    const chartRect = e.currentTarget.getBoundingClientRect()
    const dropY = e.clientY - chartRect.top
    const dropIndex = Math.floor((dropY / chartRect.height) * 3)
    
    dispatch({
      type: "SET_PRIORITY_TASK",
      payload: { taskId, index: Math.min(2, Math.max(0, dropIndex)) }
    })
    
    setDraggingTask(null)
  }

  return (
    <div className="relative h-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      {state.priorityTasks.map((taskId, index) => {
        const taskData = state.tasks.find((t) => t.id === taskId)
        if (!taskData) return null
        return (
          <Card
            key={taskId || `empty-${index}`}
            className="absolute left-0 right-0 bg-primary/90 text-primary-foreground hover:bg-primary transition-colors"
            style={{ 
              top: `${index * 33.33}%`, 
              height: "33.33%",
              width: "100%",
              minHeight: "60px"
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, taskId)}
          >
            <CardContent className="p-2 text-xs overflow-hidden flex items-center h-full">
              <span className="truncate">{taskData.text}</span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 