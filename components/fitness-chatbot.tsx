"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, Send, Bot, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fitnessVenues } from "@/lib/fitness-data"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function FitnessChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your fitness assistant. I can help you find the perfect gym or studio. Ask me about locations, prices, services, or anything else!",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Price-related questions
    if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("cheap") ||
      lowerMessage.includes("expensive")
    ) {
      const cheapest = fitnessVenues.reduce((prev, current) => (prev.price < current.price ? prev : current))
      const mostExpensive = fitnessVenues.reduce((prev, current) => (prev.price > current.price ? prev : current))
      return `Our prices range from $${cheapest.price}/week (${cheapest.name}) to $${mostExpensive.price}/week (${mostExpensive.name}). The average is around $42/week. Would you like me to show you venues in a specific price range?`
    }

    // Location-related questions
    if (
      lowerMessage.includes("location") ||
      lowerMessage.includes("where") ||
      lowerMessage.includes("sydney") ||
      lowerMessage.includes("melbourne")
    ) {
      const cities = [...new Set(fitnessVenues.map((v) => v.city))]
      return `We have fitness venues across ${cities.join(", ")}. Sydney has the most options with venues in Bondi Beach, Newtown, and Manly. Melbourne has great options in the CBD, Fitzroy, and Toorak. Which city interests you most?`
    }

    // Service-related questions
    if (lowerMessage.includes("sauna") || lowerMessage.includes("services") || lowerMessage.includes("amenities")) {
      const saunaVenues = fitnessVenues.filter((v) => v.services.includes("Sauna"))
      return `${saunaVenues.length} venues offer saunas: ${saunaVenues.map((v) => v.name).join(", ")}. Other popular services include Personal Training, 24/7 Access, and Parking. What specific amenities are you looking for?`
    }

    // Category-related questions
    if (
      lowerMessage.includes("yoga") ||
      lowerMessage.includes("gym") ||
      lowerMessage.includes("pilates") ||
      lowerMessage.includes("boxing")
    ) {
      let category = ""
      if (lowerMessage.includes("yoga")) category = "Yoga"
      else if (lowerMessage.includes("pilates")) category = "Pilates"
      else if (lowerMessage.includes("boxing")) category = "Boxing"
      else if (lowerMessage.includes("gym")) category = "Gym"

      if (category) {
        const categoryVenues = fitnessVenues.filter((v) => v.category === category)
        return `We have ${categoryVenues.length} ${category.toLowerCase()} venues: ${categoryVenues.map((v) => `${v.name} (${v.location})`).join(", ")}. Would you like more details about any of these?`
      }
    }

    // Vibe-related questions
    if (
      lowerMessage.includes("vibe") ||
      lowerMessage.includes("atmosphere") ||
      lowerMessage.includes("community") ||
      lowerMessage.includes("intense")
    ) {
      return `Our venues offer different vibes: Performance & Intensity (for serious athletes), Calm & Wellness (for mindful fitness), Community & Support (for social workouts), Modern & Tech-Forward (for tech enthusiasts), and Flexibility & Lifestyle (for busy schedules). Which vibe appeals to you?`
    }

    // Recommendations
    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest") || lowerMessage.includes("best")) {
      const topRated = fitnessVenues.filter((v) => v.rating >= 4.7).sort((a, b) => b.rating - a.rating)
      return `Based on ratings, I'd recommend: ${topRated
        .slice(0, 3)
        .map((v) => `${v.name} (${v.rating}⭐ in ${v.location})`)
        .join(
          ", ",
        )}. These venues consistently receive excellent reviews. Would you like more details about any of them?`
    }

    // Default response
    return "I can help you find information about our fitness venues! Try asking about prices, locations, services, or specific types of workouts. You can also ask for recommendations based on your preferences."
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: generateBotResponse(inputMessage),
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, botResponse])
    setInputMessage("")
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
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
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
        <ScrollArea className="flex-1 p-4">
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
                  {message.content}
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

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about gyms, prices, locations..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
