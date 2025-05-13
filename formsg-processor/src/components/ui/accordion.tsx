"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionProps {
  children: React.ReactNode
  type?: "single" | "multiple"
  collapsible?: boolean
  className?: string
}

const Accordion: React.FC<AccordionProps> = ({ 
  children, 
  type = "single",
  collapsible = false,
  className 
}) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (value: string) => {
    if (type === "single") {
      if (openItems.includes(value) && collapsible) {
        setOpenItems([])
      } else {
        setOpenItems([value])
      }
    } else {
      if (openItems.includes(value)) {
        setOpenItems(openItems.filter(item => item !== value))
      } else {
        setOpenItems([...openItems, value])
      }
    }
  }

  // Clone children and pass the isOpen and toggle function
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        isOpen: openItems.includes(child.props.value),
        onToggle: () => toggleItem(child.props.value),
      })
    }
    return child
  })

  return (
    <div className={cn("space-y-1", className)}>
      {childrenWithProps}
    </div>
  )
}

interface AccordionItemProps {
  children: React.ReactNode
  value: string
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  children, 
  value,
  isOpen,
  onToggle,
  className 
}) => {
  // Extract trigger and content from children
  let trigger: React.ReactNode = null
  let content: React.ReactNode = null

  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      if (child.type === AccordionTrigger) {
        trigger = React.cloneElement(child as React.ReactElement<any>, {
          isOpen,
          onClick: onToggle
        })
      } else if (child.type === AccordionContent) {
        content = React.cloneElement(child as React.ReactElement<any>, {
          isOpen
        })
      }
    }
  })

  return (
    <div className={cn("border-b", className)}>
      {trigger}
      {content}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  isOpen?: boolean
  onClick?: () => void
  className?: string
}

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ 
  children, 
  isOpen, 
  onClick,
  className 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline",
        className
      )}
    >
      {children}
      <ChevronDown 
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )} 
      />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  isOpen?: boolean
  className?: string
}

const AccordionContent: React.FC<AccordionContentProps> = ({ 
  children, 
  isOpen, 
  className 
}) => {
  if (!isOpen) return null

  return (
    <div className={cn("overflow-hidden pb-4 pt-0 text-sm", className)}>
      {children}
    </div>
  )
}

// Simple standalone accordion item for easier use
export function SimpleAccordion({ 
  title, 
  children,
  defaultOpen = false,
  className 
}: { 
  title: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className={cn("border-b", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline"
      >
        {title}
        <ChevronDown 
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      {isOpen && (
        <div className="overflow-hidden pb-4 pt-0 text-sm">
          {children}
        </div>
      )}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } 