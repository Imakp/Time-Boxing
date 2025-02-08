"use client"

import { useTaskContext } from "./TaskContext"
import TaskList from "./TaskList"
import PriorityTasks from "./PriorityTasks"
import TimeAllocationChart from "./TimeAllocationChart"
import CurrentDate from "./CurrentDate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PriorityTasksChart from "./PriorityTasksChart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Planner() {
  const { state } = useTaskContext()
  const isMobile = useMediaQuery("(max-width: 1024px)")

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <Card className="shrink-0">
          <CardHeader className="p-3">
            <CardTitle className="text-base font-medium">Top 3 Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-2" style={{ height: "200px" }}>
            <PriorityTasksChart allocations={new Map([["priority", state.priorityTasks.map(id => ({ id }))]])} />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="p-3">
            <CardTitle className="text-base font-medium">Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className={`${isMobile ? 'h-[calc(100vh-480px)]' : 'h-[400px]'}`}>
              <TaskList tasks={state.tasks} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full lg:w-1/2 flex flex-col">
        <CardHeader className="p-3">
          <CardTitle className="text-base font-medium">24-Hour Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex-1">
          <ScrollArea className={`${isMobile ? 'h-[600px]' : 'h-[calc(100vh-200px)]'}`}>
            <TimeAllocationChart allocations={state.timeAllocations} />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}