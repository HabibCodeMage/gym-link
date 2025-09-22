"use client"

import type React from "react"

import { useState } from "react"
import { Sparkles, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type FitnessVenue } from "@/lib/fitness-data"
import api from "@/api"

interface AISearchProps {
  onSearchResults: (venues: FitnessVenue[], query: string, hasMore?: boolean, nextCursor?: string, explanation?: string) => void
}

export function AISearch({ onSearchResults }: AISearchProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastQuery, setLastQuery] = useState("")

  const parseNaturalLanguageQuery = (
    query: string,
  ): {
    categories: string[]
    cities: string[]
    services: string[]
    priceRange: { min: number; max: number } | null
    vibe: string | null
  } => {
    const lowerQuery = query.toLowerCase()

    // Extract categories
    const categories: string[] = []
    if (lowerQuery.includes("gym") || lowerQuery.includes("weight")) categories.push("Gym")
    if (lowerQuery.includes("yoga")) categories.push("Yoga")
    if (lowerQuery.includes("pilates")) categories.push("Pilates")
    if (lowerQuery.includes("boxing") || lowerQuery.includes("fight")) categories.push("Boxing")
    if (lowerQuery.includes("crossfit") || lowerQuery.includes("cross fit")) categories.push("CrossFit")
    if (lowerQuery.includes("swim") || lowerQuery.includes("pool")) categories.push("Swimming")
    if (lowerQuery.includes("dance")) categories.push("Dance")

    // Extract cities
    const cities: string[] = []
    if (
      lowerQuery.includes("sydney") ||
      lowerQuery.includes("bondi") ||
      lowerQuery.includes("newtown") ||
      lowerQuery.includes("manly")
    )
      cities.push("Sydney")
    if (lowerQuery.includes("melbourne") || lowerQuery.includes("fitzroy") || lowerQuery.includes("toorak"))
      cities.push("Melbourne")
    if (lowerQuery.includes("gold coast") || lowerQuery.includes("surfers paradise")) cities.push("Gold Coast")
    if (lowerQuery.includes("byron bay")) cities.push("Byron Bay")

    // Extract services
    const services: string[] = []
    if (lowerQuery.includes("sauna")) services.push("Sauna")
    if (lowerQuery.includes("personal train") || lowerQuery.includes("pt")) services.push("Personal Training")
    if (lowerQuery.includes("24/7") || lowerQuery.includes("24 hour") || lowerQuery.includes("always open"))
      services.push("24/7 Access")
    if (lowerQuery.includes("parking") || lowerQuery.includes("park")) services.push("Parking")
    if (lowerQuery.includes("childcare") || lowerQuery.includes("kids")) services.push("Childcare")
    if (lowerQuery.includes("pool") || lowerQuery.includes("swimming")) services.push("Swimming Pool")

    // Extract price preferences
    let priceRange: { min: number; max: number } | null = null
    if (lowerQuery.includes("cheap") || lowerQuery.includes("budget") || lowerQuery.includes("affordable")) {
      priceRange = { min: 0, max: 40 }
    } else if (lowerQuery.includes("expensive") || lowerQuery.includes("premium") || lowerQuery.includes("luxury")) {
      priceRange = { min: 50, max: 100 }
    }

    // Extract vibe
    let vibe: string | null = null
    if (lowerQuery.includes("intense") || lowerQuery.includes("performance") || lowerQuery.includes("serious")) {
      vibe = "Performance & Intensity"
    } else if (
      lowerQuery.includes("calm") ||
      lowerQuery.includes("peaceful") ||
      lowerQuery.includes("wellness") ||
      lowerQuery.includes("relax")
    ) {
      vibe = "Calm & Wellness"
    } else if (lowerQuery.includes("community") || lowerQuery.includes("friendly") || lowerQuery.includes("social")) {
      vibe = "Community & Support"
    } else if (lowerQuery.includes("modern") || lowerQuery.includes("tech") || lowerQuery.includes("high-tech")) {
      vibe = "Modern & Tech-Forward"
    } else if (lowerQuery.includes("flexible") || lowerQuery.includes("lifestyle")) {
      vibe = "Flexibility & Lifestyle"
    }

    return { categories, cities, services, priceRange, vibe }
  }

  const handleAISearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setLastQuery(query)

    try {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Call RAG-based AI search backend
      const response = await api.aiSearchService.search({
        query: query,
        limit: 50, // Get more results for AI search
      })
      
      onSearchResults(response.venues, query, response.hasMore, response.nextCursor, response.explanation)
    } catch (error) {
      console.error('AI Search error:', error)
      // Fallback to empty results on error
      onSearchResults([], query)
    } finally {
      setIsLoading(false)
      setQuery("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAISearch()
    }
  }

  const exampleQueries = [
    "Find cheap yoga in Sydney with sauna",
    "Modern gym in Melbourne with 24/7 access",
    "Community-focused CrossFit near Gold Coast",
    "Peaceful pilates studio with parking",
  ]

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI-Powered Search
        </CardTitle>
        <p className="text-sm text-muted-foreground">Describe what you're looking for in natural language</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., 'Find a modern gym in Sydney with sauna and parking'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleAISearch} disabled={!query.trim() || isLoading} className="px-6">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        {lastQuery && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Last search:</span> "{lastQuery}"
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setQuery(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
