"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
  className?: string
}

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

interface TooltipTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ 
  children,
  className
}) => {
  return (
    <span className={cn("inline-block cursor-help", className)}>
      {children}
    </span>
  )
}

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
  sideOffset?: number
}

const TooltipContent: React.FC<TooltipContentProps & React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  sideOffset = 4,
  ...props
}) => {
  return (
    <div
      className={cn(
        "absolute z-50 max-w-xs translate-y-[-100%] translate-x-[-50%] rounded-md border bg-white px-3 py-1.5 text-sm shadow-md dark:bg-gray-900 dark:text-gray-100",
        className
      )}
      style={{ marginTop: `-${sideOffset}px` }}
      {...props}
    >
      {children}
      <div className="absolute left-1/2 top-[100%] h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b bg-white dark:bg-gray-900"></div>
    </div>
  )
}

// Simple tooltip wrapper component
export function SimpleTooltip({ 
  children, 
  content,
  className
}: { 
  children: React.ReactNode
  content: React.ReactNode
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={cn(
            "absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-md border bg-white px-3 py-1.5 text-sm shadow-md dark:bg-gray-900 dark:text-gray-100",
            className
          )}
        >
          {content}
          <div className="absolute left-1/2 top-[100%] h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b bg-white dark:bg-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } 