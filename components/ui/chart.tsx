"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Chart container
const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("h-full w-full", className)} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

// Chart component
const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("h-full w-full", className)} {...props} />
))
Chart.displayName = "Chart"

// Chart tooltip
const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-background p-2 shadow-md", className)} {...props} />
  ),
)
ChartTooltip.displayName = "ChartTooltip"

// Chart tooltip content
const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm", className)} {...props} />,
)
ChartTooltipContent.displayName = "ChartTooltipContent"

// Chart legend
const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap items-center gap-4 text-sm", className)} {...props} />
  ),
)
ChartLegend.displayName = "ChartLegend"

// Chart legend item
const ChartLegendItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    color?: string
  }
>(({ className, color, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
    <span className="text-sm font-medium">{props.children}</span>
  </div>
))
ChartLegendItem.displayName = "ChartLegendItem"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }

