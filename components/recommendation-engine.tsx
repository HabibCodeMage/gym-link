"use client"

import { useState } from "react"
import { Target, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { fitnessVenues, type FitnessVenue } from "@/lib/fitness-data"

interface RecommendationEngineProps {
  onRecommendation: (venues: FitnessVenue[], preferences: UserPreferences) => void
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

  const generateRecommendations = (prefs: UserPreferences): FitnessVenue[] => {
    const scoredVenues = fitnessVenues.map((venue) => {
      let score = 0

      // Goal-based scoring
      if (prefs.goal === "weight-loss" && (venue.category === "Gym" || venue.category === "CrossFit")) score += 3
      if (prefs.goal === "strength" && venue.category === "Gym") score += 3
      if (prefs.goal === "flexibility" && (venue.category === "Yoga" || venue.category === "Pilates")) score += 3
      if (prefs.goal === "wellness" && (venue.category === "Yoga" || venue.vibe === "Calm & Wellness")) score += 3
      if (prefs.goal === "sport" && (venue.category === "Boxing" || venue.category === "CrossFit")) score += 3

      // Budget scoring
      if (prefs.budget === "budget" && venue.price < 35) score += 2
      if (prefs.budget === "moderate" && venue.price >= 35 && venue.price <= 45) score += 2
      if (prefs.budget === "premium" && venue.price > 45) score += 2

      // Location scoring
      if (prefs.location === "sydney" && venue.city === "Sydney") score += 2
      if (prefs.location === "melbourne" && venue.city === "Melbourne") score += 2
      if (prefs.location === "gold-coast" && venue.city === "Gold Coast") score += 2

      // Schedule scoring (24/7 access for flexible schedules)
      if (prefs.schedule === "flexible" && venue.services.includes("24/7 Access")) score += 1

      // Vibe scoring
      if (prefs.vibe === "intense" && venue.vibe === "Performance & Intensity") score += 2
      if (prefs.vibe === "calm" && venue.vibe === "Calm & Wellness") score += 2
      if (prefs.vibe === "social" && venue.vibe === "Community & Support") score += 2
      if (prefs.vibe === "tech" && venue.vibe === "Modern & Tech-Forward") score += 2
      if (prefs.vibe === "flexible" && venue.vibe === "Flexibility & Lifestyle") score += 2

      // Rating bonus
      score += venue.rating * 0.5

      return { venue, score }
    })

    return scoredVenues
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.venue)
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const recommendations = generateRecommendations(preferences)
      onRecommendation(recommendations, preferences)
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
          <Button onClick={handleNext} disabled={!canProceed} className="flex items-center gap-2">
            {isLastStep ? (
              <>
                <Sparkles className="w-4 h-4" />
                Get Recommendations
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
