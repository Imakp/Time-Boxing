"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, Trash2, PanelLeftClose } from "lucide-react"
import { persistPlanner, loadPlanner, deletePlanner } from "../utils/storage"
import { useToast } from "@/components/ui/use-toast"

interface SidebarProps {
  isOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setSidebarOpen }: SidebarProps) {
  const { toast } = useToast();
  const [planners, setPlanners] = useState<Array<{ id: string; name: string; date: string }>>([])
  const [mounted, setMounted] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const handleDelete = (id: string) => {
    setPlanners(planners.filter(planner => planner.id !== id))
    deletePlanner(id)
  }

  useEffect(() => {
    setMounted(true)
    const clientSavedPlanners = Array.from({ length: localStorage.length }, (_, i) => {
      const key = localStorage.key(i)
      return key?.startsWith('planner-') ? loadPlanner(key.split('-')[1]) : null
    }).filter(Boolean)
    
    setPlanners(clientSavedPlanners.length > 0 ? clientSavedPlanners : [
      { id: "1", name: today, date: today }
    ])
  }, [])

  return (
    <aside className={`w-full lg:w-64 bg-background border-r fixed lg:relative h-screen z-50 overflow-hidden ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="lg:hidden flex justify-end p-2">
        <Button variant="ghost" onClick={() => setSidebarOpen(false)}>
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Time-Boxing</h1>
        <Button className="w-full mb-4" onClick={() => {
          if (typeof window === "undefined") return;
          
          const existingTodayPlanner = planners.some(p => p.date === today);
          
          if (existingTodayPlanner) {
            toast({
              title: "Daily Limit Reached",
              description: "You can only create one planner per day"
            });
            return;
          }

          const newId = Date.now().toString();
          const newPlanner = {
            id: newId,
            name: today,
            date: today
          };
          setPlanners([...planners, newPlanner]);
          persistPlanner(newPlanner);
        }}>
          <Plus className="mr-2 h-4 w-4" /> New Planner
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search planners..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
          {mounted && planners.map((planner) => (
            <Button 
              key={planner.id} 
              variant="ghost" 
              className="w-full justify-start mb-2 group"
            >
              {planner.name}
              <Trash2 
                className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 text-destructive pointer-events-none group-hover:pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(planner.id);
                }}
              />
            </Button>
          ))}
        </div>
        </ScrollArea>
      </div>
    </aside>
  )
}

