"use client"

import { useState } from "react"
import { TaskProvider } from "../components/TaskContext"
import Sidebar from "../components/Sidebar"
import Planner from "../components/Planner"
import { Button } from "@/components/ui/button"
import { PanelLeftOpen, PanelLeftClose } from "lucide-react"
import CurrentDate from "../components/CurrentDate"

export default function TimerBoxingApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <TaskProvider>
      <div className="h-screen flex lg:grid lg:grid-cols-[auto_1fr]">
        <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          <header className="flex items-center p-4 border-b shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
            </Button>
            <CurrentDate />
          </header>
          <main className="flex-1 p-4 overflow-auto">
            <Planner />
          </main>
        </div>
      </div>
    </TaskProvider>
  )
}