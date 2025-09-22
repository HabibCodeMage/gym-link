"use client"

import { useState } from "react"
import { ChevronDown, X, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { categories, vibes, cities } from "@/lib/fitness-data"

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  categories: string[]
  vibes: string[]
  cities: string[]
  priceRange: [number, number]
  services: string[]
  rating: number
  hasParking: boolean
  has24HourAccess: boolean
  hasSauna: boolean
  hasPersonalTraining: boolean
}

const availableServices = [
  "Personal Training",
  "Group Classes",
  "Sauna",
  "24/7 Access",
  "Parking",
  "Childcare",
  "Nutrition Coaching",
  "Physiotherapy",
  "Swimming Pool",
  "Recovery Zone",
  "Locker Rooms",
  "Showers",
]

export function AdvancedFilters({ isOpen, onClose, filters, onFiltersChange }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const toggleArrayFilter = (key: "categories" | "vibes" | "cities" | "services", value: string) => {
    const currentArray = localFilters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
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
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    return (
      localFilters.categories.length +
      localFilters.vibes.length +
      localFilters.cities.length +
      localFilters.services.length +
      (localFilters.rating > 0 ? 1 : 0) +
      (localFilters.hasParking ? 1 : 0) +
      (localFilters.has24HourAccess ? 1 : 0) +
      (localFilters.hasSauna ? 1 : 0) +
      (localFilters.hasPersonalTraining ? 1 : 0)
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            Advanced Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Price Range (per week)</Label>
            <div className="px-3">
              <Slider
                value={localFilters.priceRange}
                onValueChange={(value) => updateFilter("priceRange", value)}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${localFilters.priceRange[0]}</span>
                <span>${localFilters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Minimum Rating</Label>
            <div className="px-3">
              <Slider
                value={[localFilters.rating]}
                onValueChange={(value) => updateFilter("rating", value[0])}
                max={5}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Any Rating</span>
                <span>{localFilters.rating.toFixed(1)}+ stars</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <Label className="text-base font-medium cursor-pointer">Categories</Label>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.slice(1).map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={localFilters.categories.includes(category)}
                      onCheckedChange={() => toggleArrayFilter("categories", category)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Vibes */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <Label className="text-base font-medium cursor-pointer">Vibes</Label>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {vibes.slice(1).map((vibe) => (
                  <div key={vibe} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vibe-${vibe}`}
                      checked={localFilters.vibes.includes(vibe)}
                      onCheckedChange={() => toggleArrayFilter("vibes", vibe)}
                    />
                    <Label htmlFor={`vibe-${vibe}`} className="text-sm cursor-pointer">
                      {vibe}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Cities */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <Label className="text-base font-medium cursor-pointer">Cities</Label>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cities.slice(1).map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={localFilters.cities.includes(city)}
                      onCheckedChange={() => toggleArrayFilter("cities", city)}
                    />
                    <Label htmlFor={`city-${city}`} className="text-sm cursor-pointer">
                      {city}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Services */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <Label className="text-base font-medium cursor-pointer">Services & Amenities</Label>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableServices.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={localFilters.services.includes(service)}
                      onCheckedChange={() => toggleArrayFilter("services", service)}
                    />
                    <Label htmlFor={`service-${service}`} className="text-sm cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Quick Filters */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Quick Filters</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={localFilters.hasParking}
                  onCheckedChange={(checked) => updateFilter("hasParking", checked)}
                />
                <Label htmlFor="parking" className="text-sm cursor-pointer">
                  Has Parking
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="24hour"
                  checked={localFilters.has24HourAccess}
                  onCheckedChange={(checked) => updateFilter("has24HourAccess", checked)}
                />
                <Label htmlFor="24hour" className="text-sm cursor-pointer">
                  24/7 Access
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sauna"
                  checked={localFilters.hasSauna}
                  onCheckedChange={(checked) => updateFilter("hasSauna", checked)}
                />
                <Label htmlFor="sauna" className="text-sm cursor-pointer">
                  Has Sauna
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pt"
                  checked={localFilters.hasPersonalTraining}
                  onCheckedChange={(checked) => updateFilter("hasPersonalTraining", checked)}
                />
                <Label htmlFor="pt" className="text-sm cursor-pointer">
                  Personal Training
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={clearAllFilters} variant="outline" className="flex-1 bg-transparent">
              Clear All
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters ({getActiveFilterCount()})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
