"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, Star, DollarSign, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fitnessVenues, categories, vibes, cities, type FitnessVenue } from "@/lib/fitness-data"
import { AdvancedFilters, type FilterState } from "@/components/advanced-filters"
import { AISearch } from "@/components/ai-search"
import { FitnessChatbot } from "@/components/fitness-chatbot"
import { RecommendationEngine } from "@/components/recommendation-engine"

export default function GymLinkPlatform() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedVibe, setSelectedVibe] = useState("All")
  const [selectedCity, setSelectedCity] = useState("All")
  const [priceRange, setPriceRange] = useState("All")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [aiSearchResults, setAISearchResults] = useState<FitnessVenue[] | null>(null)
  const [aiSearchQuery, setAISearchQuery] = useState("")
  const [recommendations, setRecommendations] = useState<FitnessVenue[] | null>(null)
  const [activeTab, setActiveTab] = useState("search")
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

  const filteredVenues = useMemo(() => {
    // If we have AI search results, show those
    if (aiSearchResults) return aiSearchResults

    // If we have recommendations, show those
    if (recommendations) return recommendations

    return fitnessVenues.filter((venue) => {
      // Basic search
      const matchesSearch =
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase()))

      // Basic filters
      const matchesCategory = selectedCategory === "All" || venue.category === selectedCategory
      const matchesVibe = selectedVibe === "All" || venue.vibe === selectedVibe
      const matchesCity = selectedCity === "All" || venue.city === selectedCity

      let matchesPrice = true
      if (priceRange === "Under $35") matchesPrice = venue.price < 35
      else if (priceRange === "$35-$45") matchesPrice = venue.price >= 35 && venue.price <= 45
      else if (priceRange === "Over $45") matchesPrice = venue.price > 45

      // Advanced filters
      const matchesAdvancedCategories =
        advancedFilters.categories.length === 0 || advancedFilters.categories.includes(venue.category)
      const matchesAdvancedVibes = advancedFilters.vibes.length === 0 || advancedFilters.vibes.includes(venue.vibe)
      const matchesAdvancedCities = advancedFilters.cities.length === 0 || advancedFilters.cities.includes(venue.city)
      const matchesAdvancedPrice =
        venue.price >= advancedFilters.priceRange[0] && venue.price <= advancedFilters.priceRange[1]
      const matchesAdvancedServices =
        advancedFilters.services.length === 0 ||
        advancedFilters.services.every((service) => venue.services.includes(service))
      const matchesRating = venue.rating >= advancedFilters.rating

      // Quick filters
      const matchesParking = !advancedFilters.hasParking || venue.services.includes("Parking")
      const matches24Hour = !advancedFilters.has24HourAccess || venue.services.includes("24/7 Access")
      const matchesSauna = !advancedFilters.hasSauna || venue.services.includes("Sauna")
      const matchesPT = !advancedFilters.hasPersonalTraining || venue.services.includes("Personal Training")

      return (
        matchesSearch &&
        matchesCategory &&
        matchesVibe &&
        matchesCity &&
        matchesPrice &&
        matchesAdvancedCategories &&
        matchesAdvancedVibes &&
        matchesAdvancedCities &&
        matchesAdvancedPrice &&
        matchesAdvancedServices &&
        matchesRating &&
        matchesParking &&
        matches24Hour &&
        matchesSauna &&
        matchesPT
      )
    })
  }, [
    searchQuery,
    selectedCategory,
    selectedVibe,
    selectedCity,
    priceRange,
    advancedFilters,
    aiSearchResults,
    recommendations,
  ])

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
      (advancedFilters.hasPersonalTraining ? 1 : 0)
    )
  }

  const handleAISearchResults = (venues: FitnessVenue[], query: string) => {
    setAISearchResults(venues)
    setAISearchQuery(query)
    setRecommendations(null)
    setActiveTab("search")
  }

  const handleRecommendations = (venues: FitnessVenue[]) => {
    setRecommendations(venues)
    setAISearchResults(null)
    setActiveTab("search")
  }

  const clearSpecialResults = () => {
    setAISearchResults(null)
    setRecommendations(null)
    setAISearchQuery("")
  }

  const getResultsTitle = () => {
    if (aiSearchResults) {
      return `AI Search Results for "${aiSearchQuery}" (${filteredVenues.length} found)`
    }
    if (recommendations) {
      return `Personalized Recommendations (${filteredVenues.length} venues)`
    }
    return `${filteredVenues.length} Fitness Venues Found`
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value)
                      clearSpecialResults()
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Vibe Filter */}
                  <Select
                    value={selectedVibe}
                    onValueChange={(value) => {
                      setSelectedVibe(value)
                      clearSpecialResults()
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vibe" />
                    </SelectTrigger>
                    <SelectContent>
                      {vibes.map((vibe) => (
                        <SelectItem key={vibe} value={vibe}>
                          {vibe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* City Filter */}
                  <Select
                    value={selectedCity}
                    onValueChange={(value) => {
                      setSelectedCity(value)
                      clearSpecialResults()
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Price Filter */}
                  <Select
                    value={priceRange}
                    onValueChange={(value) => {
                      setPriceRange(value)
                      clearSpecialResults()
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Prices</SelectItem>
                      <SelectItem value="Under $35">Under $35/week</SelectItem>
                      <SelectItem value="$35-$45">$35-$45/week</SelectItem>
                      <SelectItem value="Over $45">Over $45/week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-search">
              <AISearch onSearchResults={handleAISearchResults} />
            </TabsContent>

            <TabsContent value="recommendations">
              <RecommendationEngine onRecommendation={handleRecommendations} />
            </TabsContent>
          </Tabs>

          {/* Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">{getResultsTitle()}</h3>
              <div className="flex gap-2">
                {(aiSearchResults || recommendations) && (
                  <Button variant="outline" size="sm" onClick={clearSpecialResults}>
                    Show All Venues
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(true)} className="relative">
                  <Sliders className="w-4 h-4 mr-2" />
                  Advanced Filters
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>

            {filteredVenues.length === 0 && (
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
              {venue.location}
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

        <div className="mb-3">
          <Badge variant="outline" className="text-xs mb-2">
            {venue.vibe}
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
