"use client"

import React, { useState, createContext, useContext } from "react"
import { cn } from "@/lib/utils"

// Context for tab state
interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function useTabs() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
  onValueChange?: (value: string) => void
}

const Tabs: React.FC<TabsProps> = ({ 
  defaultValue, 
  children, 
  className,
  onValueChange 
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onValueChange?.(value)
  }
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  children, 
  className,
  onClick,
  disabled = false
}) => {
  const { activeTab, setActiveTab } = useTabs()
  
  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value)
      onClick?.()
    }
  }
  
  const isActive = activeTab === value
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      data-value={value}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-background text-foreground shadow-sm",
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  children, 
  className 
}) => {
  const { activeTab } = useTabs()
  
  if (activeTab !== value) {
    return null
  }
  
  return (
    <div
      role="tabpanel"
      data-state={activeTab === value ? "active" : "inactive"}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  )
}

// Simple tabs component for easier use
export function SimpleTabs({ 
  tabs, 
  defaultTab = 0,
  className 
}: { 
  tabs: { title: React.ReactNode, content: React.ReactNode }[]
  defaultTab?: number
  className?: string
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              activeTab === index 
                ? "border-b-2 border-primary text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent } 