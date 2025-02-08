"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function CurrentDate() {
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const date = new Date()
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{currentDate}</h2>
    </div>
  )
}

