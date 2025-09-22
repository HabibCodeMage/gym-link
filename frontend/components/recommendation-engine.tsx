"use client"

import { useState } from "react"
import { Target, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { type FitnessVenue } from "@/lib/fitness-data"
import api from "@/api"

interface RecommendationEngineProps {
  onRecommendation: (venues: FitnessVenue[], preferences: UserPreferences, explanation?: string, algorithm?: string, confidence?: number) => void
}

interface UserPreferences {
  goal: string
  experience: string
  budget: string
  location: string
  schedule: string
  vibe: string
}

export function RecommendationEngine({ onRecommendation }: RecommendationEngineProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    goal: "",
    experience: "",
    budget: "",
    location: "",
    schedule: "",
    vibe: "",
  })

  const questions = [
    {
      id: "goal",
      title: "What's your primary fitness goal?",
      options: [
        { value: "weight-loss", label: "Weight Loss & Cardio" },
        { value: "strength", label: "Build Strength & Muscle" },
        { value: "flexibility", label: "Flexibility & Mobility" },
        { value: "wellness", label: "Mental Wellness & Stress Relief" },
        { value: "sport", label: "Sport-Specific Training" },
      ],
    },
    {
      id: "experience",
      title: "What's your fitness experience level?",
      options: [
        { value: "beginner", label: "Beginner - Just starting out" },
        { value: "intermediate", label: "Intermediate - Some experience" },
        { value: "advanced", label: "Advanced - Very experienced" },
        { value: "returning", label: "Returning after a break" },
      ],
    },
    {
      id: "budget",
      title: "What's your weekly budget?",
      options: [
        { value: "budget", label: "Under $35/week" },
        { value: "moderate", label: "$35-$45/week" },
        { value: "premium", label: "$45+/week" },
        { value: "flexible", label: "Budget is flexible" },
      ],
    },
    {
      id: "location",
      title: "Where would you prefer to work out?",
      options: [
        { value: "sydney", label: "Sydney area" },
        { value: "melbourne", label: "Melbourne area" },
        { value: "gold-coast", label: "Gold Coast area" },
        { value: "anywhere", label: "Anywhere in Australia" },
      ],
    },
    {
      id: "schedule",
      title: "When do you prefer to work out?",
      options: [
        { value: "morning", label: "Early morning (6-9 AM)" },
        { value: "day", label: "During the day (9 AM-5 PM)" },
        { value: "evening", label: "Evening (5-8 PM)" },
        { value: "flexible", label: "Flexible schedule" },
      ],
    },
    {
      id: "vibe",
      title: "What kind of atmosphere do you prefer?",
      options: [
        { value: "intense", label: "High-energy and competitive" },
        { value: "calm", label: "Peaceful and mindful" },
        { value: "social", label: "Community-focused and friendly" },
        { value: "tech", label: "Modern with latest technology" },
        { value: "flexible", label: "Adaptable to my lifestyle" },
      ],
    },
  ]

  const mapPreferencesToBackend = (prefs: UserPreferences) => {
    // Map frontend preferences to backend parameters
    const preferences: string[] = []
    let category: string | undefined
    let city: string | undefined
    let maxPrice: number | undefined

    // Map goal to categories
    if (prefs.goal === "weight-loss") preferences.push("Gym", "CrossFit")
    if (prefs.goal === "strength") preferences.push("Gym")
    if (prefs.goal === "flexibility") preferences.push("Yoga", "Pilates")
    if (prefs.goal === "wellness") preferences.push("Yoga", "Pilates")
    if (prefs.goal === "sport") preferences.push("Boxing", "CrossFit")

    // Map budget to price range
    if (prefs.budget === "budget") maxPrice = 35
    if (prefs.budget === "moderate") maxPrice = 45
    if (prefs.budget === "premium") maxPrice = 100

    // Map location to city
    if (prefs.location === "sydney") city = "Sydney"
    if (prefs.location === "melbourne") city = "Melbourne"
    if (prefs.location === "gold-coast") city = "Gold Coast"

    return { preferences, category, city, maxPrice }
  }

  const generateRecommendations = async (prefs: UserPreferences) => {
    setIsLoading(true)
    try {
      const { preferences, category, city, maxPrice } = mapPreferencesToBackend(prefs)
      
      // Call RAG-based recommendation backend
      const response = await api.recommendationsService.getRecommendations({
        preferences,
        category,
        city,
        maxPrice,
        limit: 6
      })
      
      onRecommendation(
        response.venues, 
        prefs, 
        response.explanation, 
        response.algorithm, 
        response.confidence
      )
    } catch (error) {
      console.error('Recommendation error:', error)
      // Fallback to empty results on error
      onRecommendation([], prefs)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await generateRecommendations(preferences)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updatePreference = (key: keyof UserPreferences, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1
  const canProceed = preferences[currentQuestion.id as keyof UserPreferences] !== ""

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Get Personalized Recommendations
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Step {currentStep + 1} of {questions.length}
          </span>
          <div className="flex-1 bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQuestion.title}</h3>
          <RadioGroup
            value={preferences[currentQuestion.id as keyof UserPreferences]}
            onValueChange={(value) => updatePreference(currentQuestion.id as keyof UserPreferences, value)}
          >
            {currentQuestion.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed || isLoading} className="flex items-center gap-2">
            {isLastStep ? (
              <>
                <Sparkles className="w-4 h-4" />
                {isLoading ? "Generating..." : "Get Recommendations"}
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
