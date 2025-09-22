"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, MapPin, Star, DollarSign, Sliders, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFitnessVenues } from "@/hooks/use-fitness-venues"
import { FitnessVenue, SearchFitnessVenuesParams } from "@/api/services/fitness-venues.service"
import { AdvancedFilters, type FilterState } from "@/components/advanced-filters"
import { AISearch } from "@/components/ai-search"
import { FitnessChatbot } from "@/components/fitness-chatbot"
import { RecommendationEngine } from "@/components/recommendation-engine"
import api from "@/api"

export default function GymLinkPlatform() {
  const { venues, loading, loadingMore, error, hasMore, searchVenues, fetchVenues, loadMore } = useFitnessVenues()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedVibe, setSelectedVibe] = useState("All")
  const [selectedCity, setSelectedCity] = useState("All")
  const [priceRange, setPriceRange] = useState("All")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [aiSearchResults, setAISearchResults] = useState<FitnessVenue[] | null>(null)
  const [aiSearchQuery, setAISearchQuery] = useState("")
  const [aiSearchHasMore, setAISearchHasMore] = useState(false)
  const [aiSearchNextCursor, setAISearchNextCursor] = useState<string | undefined>(undefined)
  const [aiSearchExplanation, setAISearchExplanation] = useState("")
  const [recommendations, setRecommendations] = useState<FitnessVenue[] | null>(null)
  const [recommendationExplanation, setRecommendationExplanation] = useState("")
  const [recommendationAlgorithm, setRecommendationAlgorithm] = useState("")
  const [recommendationConfidence, setRecommendationConfidence] = useState(0)
  const [activeTab, setActiveTab] = useState("search")
  const [filterOptions, setFilterOptions] = useState({
    categories: ["All", "Gym", "Yoga", "Pilates", "Boxing", "CrossFit", "Swimming", "Dance", "Martial Arts"],
    vibes: ["All", "Performance & Intensity", "Calm & Wellness", "Community & Support", "Modern & Tech-Forward", "Flexibility & Lifestyle"],
    cities: ["All", "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Byron Bay"],
  })
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    categories: [],
    vibes: [],
    cities: [],
    priceRange: [0, 100],
    services: [],
    rating: 0,
    hasParking: false,
    has24HourAccess: false,
    hasSauna: false,
    hasPersonalTraining: false,
  })
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchFitnessVenuesParams>({})

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await api.fitnessVenuesService.getFilterOptions()
        setFilterOptions({
          categories: options.categories,
          vibes: options.vibes,
          cities: options.cities,
        })
      } catch (error) {
        console.error('Failed to load filter options:', error)
      }
    }
    loadFilterOptions()
  }, [])

  // Perform search when filters change
  useEffect(() => {
    const performSearch = async () => {
      const searchParams = {
        search: searchQuery || undefined,
        // Use advanced filter arrays if they exist, otherwise use basic filter values
        categories: advancedFilters.categories.length > 0 ? advancedFilters.categories : (selectedCategory !== "All" ? [selectedCategory] : undefined),
        vibes: advancedFilters.vibes.length > 0 ? advancedFilters.vibes : (selectedVibe !== "All" ? [selectedVibe] : undefined),
        cities: advancedFilters.cities.length > 0 ? advancedFilters.cities : (selectedCity !== "All" ? [selectedCity] : undefined),
        // Use advanced filter price range if it's been modified, otherwise use basic filter
        priceMin: advancedFilters.priceRange[0] > 0 ? advancedFilters.priceRange[0] : (priceRange === "Under $35" ? 0 : priceRange === "$35-$45" ? 35 : priceRange === "Over $45" ? 45 : undefined),
        priceMax: advancedFilters.priceRange[1] < 100 ? advancedFilters.priceRange[1] : (priceRange === "Under $35" ? 34 : priceRange === "$35-$45" ? 45 : undefined),
        // Advanced filters
        services: advancedFilters.services.length > 0 ? advancedFilters.services : undefined,
        rating: advancedFilters.rating > 0 ? advancedFilters.rating : undefined,
        hasParking: advancedFilters.hasParking || undefined,
        has24HourAccess: advancedFilters.has24HourAccess || undefined,
        hasSauna: advancedFilters.hasSauna || undefined,
        hasPersonalTraining: advancedFilters.hasPersonalTraining || undefined,
      }
      
      // Check if any filters are applied
      const hasBasicFilters = searchQuery || selectedCategory !== "All" || selectedVibe !== "All" || selectedCity !== "All" || priceRange !== "All"
      const hasAdvancedFilters = advancedFilters.categories.length > 0 || advancedFilters.vibes.length > 0 || advancedFilters.cities.length > 0 || 
                                 advancedFilters.services.length > 0 || advancedFilters.rating > 0 || advancedFilters.hasParking || 
                                 advancedFilters.has24HourAccess || advancedFilters.hasSauna || advancedFilters.hasPersonalTraining ||
                                 advancedFilters.priceRange[0] > 0 || advancedFilters.priceRange[1] < 100
      
      if (!hasBasicFilters && !hasAdvancedFilters) {
        await fetchVenues()
        setCurrentSearchParams({})
      } else {
        await searchVenues(searchParams)
        setCurrentSearchParams(searchParams)
      }
    }
    performSearch()
  }, [searchQuery, selectedCategory, selectedVibe, selectedCity, priceRange, advancedFilters, searchVenues, fetchVenues])

  const filteredVenues = useMemo(() => {
    // If we have AI search results, show those
    if (aiSearchResults) return aiSearchResults

    // If we have recommendations, show those
    if (recommendations) return recommendations

    // Return venues from backend (already filtered)
    return venues
  }, [venues, aiSearchResults, recommendations])

  const getActiveFiltersCount = () => {
    return (
      advancedFilters.categories.length +
      advancedFilters.vibes.length +
      advancedFilters.cities.length +
      advancedFilters.services.length +
      (advancedFilters.rating > 0 ? 1 : 0) +
      (advancedFilters.hasParking ? 1 : 0) +
      (advancedFilters.has24HourAccess ? 1 : 0) +
      (advancedFilters.hasSauna ? 1 : 0) +
      (advancedFilters.hasPersonalTraining ? 1 : 0) +
      (advancedFilters.priceRange[0] > 0 || advancedFilters.priceRange[1] < 100 ? 1 : 0)
    )
  }

  const handleAISearchResults = (venues: FitnessVenue[], query: string, hasMore?: boolean, nextCursor?: string, explanation?: string) => {
    setAISearchResults(venues)
    setAISearchQuery(query)
    setAISearchHasMore(hasMore || false)
    setAISearchNextCursor(nextCursor)
    setAISearchExplanation(explanation || "")
    setRecommendations(null)
  }

  const handleRecommendations = (venues: FitnessVenue[], preferences?: any, explanation?: string, algorithm?: string, confidence?: number) => {
    setRecommendations(venues)
    setRecommendationExplanation(explanation || "")
    setRecommendationAlgorithm(algorithm || "")
    setRecommendationConfidence(confidence || 0)
    setAISearchResults(null)
  }

  const loadMoreAISearch = async () => {
    if (!aiSearchNextCursor || !aiSearchQuery) return
    
    try {
      setLoadingMore(true)
      
      // Call RAG-based AI search backend with cursor
      const response = await api.aiSearchService.search({
        query: aiSearchQuery,
        cursor: aiSearchNextCursor,
        limit: 50,
      })
      
      // Append new results to existing ones
      setAISearchResults(prev => prev ? [...prev, ...response.venues] : response.venues)
      setAISearchHasMore(response.hasMore)
      setAISearchNextCursor(response.nextCursor)
    } catch (error) {
      console.error('AI Search load more error:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const parseNaturalLanguageQuery = (query: string) => {
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
    if (lowerQuery.includes("sydney") || lowerQuery.includes("bondi") || lowerQuery.includes("newtown") || lowerQuery.includes("manly"))
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
    } else if (lowerQuery.includes("calm") || lowerQuery.includes("peaceful") || lowerQuery.includes("wellness") || lowerQuery.includes("relax")) {
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

  const handleQuickRecommendation = async (userType: string) => {
    try {
      const response = await api.recommendationsService.getPersonalizedRecommendations(userType, 6)
      handleRecommendations(
        response.venues, 
        {}, 
        response.explanation, 
        response.algorithm, 
        response.confidence
      )
    } catch (error) {
      console.error('Quick recommendation error:', error)
    }
  }

  const clearSpecialResults = () => {
    setAISearchResults(null)
    setRecommendations(null)
    setAISearchQuery("")
    setAISearchHasMore(false)
    setAISearchNextCursor(undefined)
    setAISearchExplanation("")
    setRecommendationExplanation("")
    setRecommendationAlgorithm("")
    setRecommendationConfidence(0)
  }



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">GL</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">GymLink</h1>
            </div>
            <p className="text-muted-foreground hidden md:block">Australia's First Fitness Comparison Platform</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Find Your Perfect
            <span className="text-primary block">Fitness Match</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Compare gyms, studios, and fitness facilities across Australia. Use AI-powered search and get personalized
            recommendations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search & Filter</TabsTrigger>
              <TabsTrigger value="ai-search">AI Search</TabsTrigger>
              <TabsTrigger value="recommendations">Get Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              {/* Traditional Search and Filters */}
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                  {/* Search */}
                  <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search gyms, locations, services..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        clearSpecialResults()
                      }}
                      className="pl-10 pr-10 w-full"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => {
                          setSearchQuery("")
                          clearSpecialResults()
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="relative w-full">
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value)
                        clearSpecialResults()
                      }}
                    >
                      <SelectTrigger className="w-full pr-8">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCategory !== "All" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => {
                          setSelectedCategory("All")
                          clearSpecialResults()
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Vibe Filter */}
                  <div className="relative w-full">
                    <Select
                      value={selectedVibe}
                      onValueChange={(value) => {
                        setSelectedVibe(value)
                        clearSpecialResults()
                      }}
                    >
                      <SelectTrigger className="w-full pr-8">
                        <SelectValue placeholder="Vibe" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.vibes.map((vibe) => (
                          <SelectItem key={vibe} value={vibe}>
                            {vibe}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedVibe !== "All" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => {
                          setSelectedVibe("All")
                          clearSpecialResults()
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* City Filter */}
                  <div className="relative w-full">
                    <Select
                      value={selectedCity}
                      onValueChange={(value) => {
                        setSelectedCity(value)
                        clearSpecialResults()
                      }}
                    >
                      <SelectTrigger className="w-full pr-8">
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCity !== "All" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => {
                          setSelectedCity("All")
                          clearSpecialResults()
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Price Filter */}
                  <div className="relative w-full">
                    <Select
                      value={priceRange}
                      onValueChange={(value) => {
                        setPriceRange(value)
                        clearSpecialResults()
                      }}
                    >
                      <SelectTrigger className="w-full pr-8">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Prices</SelectItem>
                        <SelectItem value="Under $35">Under $35/week</SelectItem>
                        <SelectItem value="$35-$45">$35-$45/week</SelectItem>
                        <SelectItem value="Over $45">Over $45/week</SelectItem>
                      </SelectContent>
                    </Select>
                    {priceRange !== "All" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => {
                          setPriceRange("All")
                          clearSpecialResults()
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Clear All Button */}
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All")
                      setSelectedVibe("All")
                      setSelectedCity("All")
                      setPriceRange("All")
                      clearSpecialResults()
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-search">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-semibold">AI</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">AI-Powered Search</h4>
                      <p className="text-blue-800 text-sm">
                        Search using natural language. Ask questions like "cheap yoga in Sydney with sauna" 
                        or "high-intensity gyms with personal training" and get intelligent, context-aware results.
                      </p>
                    </div>
                  </div>
                </div>
                <AISearch onSearchResults={handleAISearchResults} />
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="space-y-6">
                {/* Context Information */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-semibold">RAG</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900 mb-1">Personalized Recommendations</h4>
                      <p className="text-green-800 text-sm">
                        Get personalized fitness venue recommendations using advanced AI algorithms. 
                        Choose from quick recommendations or answer a few questions for tailored results.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Recommendation Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Recommendations</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Get instant recommendations based on popular user profiles
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuickRecommendation('fitness_enthusiast')}
                        className="h-auto p-3 flex flex-col items-center gap-1"
                      >
                        <span className="font-medium">Fitness Enthusiast</span>
                        <span className="text-xs text-muted-foreground">Gym, CrossFit, Boxing</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuickRecommendation('wellness_seeker')}
                        className="h-auto p-3 flex flex-col items-center gap-1"
                      >
                        <span className="font-medium">Wellness Seeker</span>
                        <span className="text-xs text-muted-foreground">Yoga, Pilates, Spa</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuickRecommendation('budget_conscious')}
                        className="h-auto p-3 flex flex-col items-center gap-1"
                      >
                        <span className="font-medium">Budget Conscious</span>
                        <span className="text-xs text-muted-foreground">Affordable options</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuickRecommendation('tech_savvy')}
                        className="h-auto p-3 flex flex-col items-center gap-1"
                      >
                        <span className="font-medium">Tech Savvy</span>
                        <span className="text-xs text-muted-foreground">Modern & High-tech</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <RecommendationEngine onRecommendation={handleRecommendations} />
              </div>
            </TabsContent>
          </Tabs>

          {/* Results */}
          <div className="space-y-6">
            {/* AI Search Explanation */}
            {aiSearchResults && aiSearchExplanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">AI</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">AI Search Results</h4>
                    <p className="text-blue-800 text-sm">{aiSearchExplanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendation Explanation */}
            {recommendations && recommendationExplanation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-semibold">RAG</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-green-900">Personalized Recommendations</h4>
                      {recommendationAlgorithm && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {recommendationAlgorithm}
                        </span>
                      )}
                      {recommendationConfidence > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {Math.round(recommendationConfidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                    <p className="text-green-800 text-sm">{recommendationExplanation}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {/* Show "Show All Venues" button when there are special results and not on search tab */}
                {(aiSearchResults || recommendations) && activeTab !== "search" && (
                  <Button variant="outline" size="sm" onClick={clearSpecialResults}>
                    Show All Venues
                  </Button>
                )}
                {/* Only show Advanced Filters button on search tab */}
                {activeTab === "search" && (
                  <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(true)} className="relative">
                    <Sliders className="w-4 h-4 mr-2" />
                    Advanced Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading venues...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-destructive text-lg">Error: {error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
                
                {/* Load More button - only show for search tab or AI search results */}
                {((aiSearchResults && aiSearchHasMore) || (!aiSearchResults && !recommendations && hasMore)) && filteredVenues.length > 0 && (
                  <div className="flex justify-center pt-6">
                    <Button
                      onClick={() => {
                        if (aiSearchResults) {
                          // Handle AI search load more
                          loadMoreAISearch()
                        } else {
                          // Handle regular search load more
                          loadMore(currentSearchParams)
                        }
                      }}
                      disabled={loadingMore}
                      variant="outline"
                      className="min-w-32"
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && filteredVenues.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No venues match your current criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                    setSelectedVibe("All")
                    setSelectedCity("All")
                    setPriceRange("All")
                    setAdvancedFilters({
                      categories: [],
                      vibes: [],
                      cities: [],
                      priceRange: [0, 100],
                      services: [],
                      rating: 0,
                      hasParking: false,
                      has24HourAccess: false,
                      hasSauna: false,
                      hasPersonalTraining: false,
                    })
                    clearSpecialResults()
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
      />

      {/* Chatbot */}
      <FitnessChatbot />
    </div>
  )
}

function VenueCard({ venue }: { venue: FitnessVenue }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={venue.image || "/placeholder.svg"}
          alt={venue.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {venue.category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-background/90 rounded-full px-2 py-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{venue.rating}</span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg mb-1">{venue.name}</CardTitle>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{venue.location}, {venue.city}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-primary font-semibold">
              <DollarSign className="w-4 h-4" />
              {venue.price}
            </div>
            <span className="text-xs text-muted-foreground">per week</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{venue.description}</p>

        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {venue.vibe}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {venue.city}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {venue.services.slice(0, 3).map((service) => (
            <Badge key={service} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
          {venue.services.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{venue.services.length - 3} more
            </Badge>
          )}
        </div>

        <Button className="w-full" size="sm">
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
