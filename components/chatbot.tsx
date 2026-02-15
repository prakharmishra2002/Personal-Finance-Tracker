"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Define the message type
interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your Finance Tracker assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = generateResponse(input)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  // Simple response generation based on keywords
  const generateResponse = (query: string): string => {
    const normalizedQuery = query.toLowerCase()

    // Check for greetings
    if (/^(hi|hello|hey|greetings)/.test(normalizedQuery)) {
      return "Hello! How can I assist you with your finance tracking today?"
    }

    // Help with using the app
    if (normalizedQuery.includes("how to use") || normalizedQuery.includes("help")) {
      return "To use Finance Tracker, you can add transactions from the dashboard by clicking the 'Add Transaction' button. You can also set budgets, view reports, and convert currencies. What specific feature would you like to learn more about?"
    }

    // About transactions
    if (
      normalizedQuery.includes("transaction") ||
      normalizedQuery.includes("expense") ||
      normalizedQuery.includes("income")
    ) {
      return "You can manage your transactions in the Transactions tab. Click 'Add Transaction' to record a new expense or income. You can categorize them, add descriptions, and filter them later for better insights."
    }

    // About budgets
    if (normalizedQuery.includes("budget")) {
      return "The Budget Management feature allows you to set spending limits for different categories. Go to the Budget tab to create new budgets, and the system will track your spending against these limits."
    }

    // About reports and charts
    if (normalizedQuery.includes("report") || normalizedQuery.includes("chart") || normalizedQuery.includes("graph")) {
      return "The Reports section provides visual analytics of your financial data. You'll find visualizations for spending by category, income vs expenses, spending trends, and more. These visualizations help you understand your financial patterns better."
    }

    // About currency conversion
    if (normalizedQuery.includes("currency") || normalizedQuery.includes("convert")) {
      return "The Currency Converter tool allows you to convert amounts between different currencies. You can access it from the Currency tab in the dashboard. It uses simulated exchange rates for demonstration purposes."
    }

    // About the project/tech stack
    if (
      normalizedQuery.includes("built with") ||
      normalizedQuery.includes("technology") ||
      normalizedQuery.includes("tech stack")
    ) {
      return "This Finance Tracker is built with Next.js, TypeScript, and Tailwind CSS. It uses shadcn/ui for components. The application is client-side only, with data stored in your browser's localStorage."
    }

    // Default response
    return "I'm not sure I understand. You can ask me about how to use the Finance Tracker, managing transactions, setting budgets, viewing reports, or converting currencies. How can I help you today?"
  }

  return (
    <>
      {/* Floating chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            onClick={toggleChat}
          >
            <Bot className="h-6 w-6" />
          </Button>

          {/* Hover tooltip */}
          {isHovered && !isOpen && (
            <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 whitespace-nowrap">
              <div className="text-sm font-medium">Hi, how can I help you?</div>
              <div className="absolute -bottom-2 right-5 w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45"></div>
            </div>
          )}
        </div>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 left-2 sm:left-auto z-50 w-auto sm:w-96 shadow-xl max-w-[calc(100vw-1rem)] sm:max-w-none">
          <Card className="border-primary/10">
            <CardHeader className="bg-muted/50 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  Finance Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[350px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-3">
              <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                <Input
                  ref={inputRef}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}

