"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTaskContext } from "./TaskContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface TimeAllocationChartProps {
  allocations: Map<string, AllocatedTask[]>
  isPriorityView?: boolean
}

interface AllocatedTask {
  id: string
  start: number // minutes from midnight
  duration: number // in minutes
}

export default function TimeAllocationChart({ allocations, isPriorityView }: TimeAllocationChartProps) {
  const { state, dispatch } = useTaskContext()
  const [draggingTask, setDraggingTask] = useState<string | null>(null)
  const [resizingTask, setResizingTask] = useState<string | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 1024px)")

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggingTask(taskId)
    e.dataTransfer.setData("text/plain", taskId)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isPriorityView && Array.from(allocations.values()).flat().length >= 3) return
    e.preventDefault()
    const taskId = e.dataTransfer.getData("text/plain")
    const chartRect = chartRef.current?.getBoundingClientRect()
    if (chartRect) {
      const dropY = e.clientY - chartRect.top + (chartRef.current?.scrollTop || 0)
      const dropTime = Math.floor((dropY / chartRect.height) * 1440)
      const duration = 60 // Default to 1 hour
      // Ensure task doesn't go past midnight
      const clampedStart = Math.max(0, Math.min(1439 - duration, dropTime))
      dispatch({
        type: "SET_TIME_ALLOCATION",
        payload: { taskId, start: clampedStart, duration }
      })
    }
    setDraggingTask(null)
  }

  const handleResizeStart = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation()
    setResizingTask(taskId)
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (resizingTask && chartRef.current) {
      const chartRect = chartRef.current.getBoundingClientRect()
      const resizeY = e.clientY - chartRect.top + (chartRef.current?.scrollTop || 0)
      const resizeTime = Math.floor((resizeY / chartRect.height) * 1440)
      const task = Array.from(allocations.values())
        .flat()
        .find((t) => t.id === resizingTask)
      if (task) {
        // Ensure duration doesn't go past midnight
        const maxDuration = 1439 - task.start
        const newDuration = Math.max(30, Math.min(maxDuration, resizeTime - task.start))
        dispatch({
          type: "UPDATE_TASK_DURATION",
          payload: { taskId: resizingTask, duration: newDuration }
        })
      }
    }
  }

  const handleResizeEnd = () => {
    setResizingTask(null)
  }

  useEffect(() => {
    if (resizingTask) {
      window.addEventListener("mousemove", handleResizeMove)
      window.addEventListener("mouseup", handleResizeEnd)
      return () => {
        window.removeEventListener("mousemove", handleResizeMove)
        window.removeEventListener("mouseup", handleResizeEnd)
      }
    }
  }, [resizingTask])

  const renderHourLines = () => {
    return Array.from({ length: 24 }, (_, i) => (
      <div 
        key={i} 
        className="border-t border-gray-200 h-16 flex items-center relative"
      >
        <span className="text-sm text-gray-500 w-12 sticky left-0 bg-background z-10">
          {`${i.toString().padStart(2, "0")}:00`}
        </span>
        <div className="flex-1 border-b border-gray-200"></div>
      </div>
    ))
  }

  const renderTasks = () => {
    if (isPriorityView) {
      return allocations.get("priority")?.map((task, index) => {
        const taskData = state.tasks.find((t) => t.id === task.id)
        if (!taskData) return null
        return (
          <Card
            key={task.id}
            className="absolute left-0 right-0 bg-primary text-primary-foreground"
            style={{ 
              top: `${index * 33}%`, 
              height: "33%",
              width: "calc(100% - 3rem)"
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
          >
            <CardContent className="p-2 text-xs overflow-hidden flex items-center">
              {taskData.text}
            </CardContent>
          </Card>
        )
      })
    }

    return Array.from(allocations.values())
      .flat()
      .map((task) => {
        const taskData = state.tasks.find((t) => t.id === task.id)
        if (!taskData) return null
        const top = (task.start / 1440) * 100
        const height = (task.duration / 1440) * 100
        return (
          <Card
            key={task.id}
            className="absolute left-12 right-4 bg-primary text-primary-foreground"
            style={{ top: `${top}%`, height: `${height}%` }}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
          >
            <CardContent className="p-2 text-xs overflow-hidden">
              {taskData.text}
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-0 right-0 cursor-ns-resize"
                onMouseDown={(e) => handleResizeStart(e, task.id)}
              >
                <GripVertical className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      })
  }

  return (
    <div 
      ref={chartRef}
      className="relative h-full overflow-hidden"
      style={{ height: isMobile ? "1440px" : "100%" }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="sticky top-0 z-20 bg-background">
        {renderHourLines()}
      </div>
      {renderTasks()}
    </div>
  )
}