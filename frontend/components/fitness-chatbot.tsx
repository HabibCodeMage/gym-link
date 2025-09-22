"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Send, Bot, User, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import api from "@/api"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
  relatedVenues?: any[]
  confidence?: number
}

export function FitnessChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen) {
      const scrollToBottom = () => {
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
          }
        }
      }
      setTimeout(scrollToBottom, 100)
    }
  }, [isOpen])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your AI-powered fitness assistant. I can help you find the perfect gym or studio using advanced RAG technology. Ask me about locations, prices, services, or anything else!",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }
      }
    }
    
    // Use setTimeout to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [messages])

  const generateBotResponse = async (userMessage: string): Promise<Message> => {
    try {
      setIsLoading(true)
      const response = await api.chatService.sendMessage({ message: userMessage })
      
      return {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: "bot",
        timestamp: new Date(),
        suggestions: response.suggestions,
        relatedVenues: response.relatedVenues,
        confidence: response.confidence
      }
    } catch (error) {
      console.error('Chat error:', error)
      return {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
        suggestions: ["What type of workout are you interested in?", "What's your budget range?", "Any specific location preferences?"]
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Generate bot response
    const botResponse = await generateBotResponse(inputMessage)
    setMessages((prev) => [...prev, botResponse])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] max-h-[80vh] h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-5 h-5 text-primary" />
          Fitness Assistant
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 max-h-[350px]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Show confidence score for bot messages */}
                  {message.sender === "bot" && message.confidence && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {Math.round(message.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  )}
                  
                  {/* Show related venues */}
                  {message.sender === "bot" && message.relatedVenues && message.relatedVenues.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">Related venues:</div>
                      {message.relatedVenues.slice(0, 2).map((venue, index) => (
                        <div key={index} className="text-xs bg-background/50 rounded p-2">
                          <div className="font-medium">{venue.name}</div>
                          <div className="text-muted-foreground">{venue.city} • ${venue.price}/week</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show suggestions */}
                  {message.sender === "bot" && message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">Quick suggestions:</div>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.slice(0, 3).map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 px-2"
                            onClick={() => setInputMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 mb-6 border-t -translate-y-2">
          <div className="flex gap-2">
            <Input
              placeholder={isLoading ? "AI is thinking..." : "Ask about gyms, prices, locations..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm" disabled={isLoading || !inputMessage.trim()}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
