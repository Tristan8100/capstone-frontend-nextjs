"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Loader2, FileText } from "lucide-react"

interface Question {
  id: number
  type: string
  question: string
  required: boolean
  placeholder?: string
  options?: string[]
  maxRating?: number
}

interface SurveyData {
  id: string
  title: string
  description: string
  createdAt: string
  status: string
  questions: Question[]
}

export default function SurveyForm() {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [submitting, setSubmitting] = useState(false)

  // Fetch survey data
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/json-file/survey-data.json")
        if (!response.ok) {
          throw new Error("Failed to fetch survey data")
        }
        const data = await response.json()
        setSurveyData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchSurveyData()
  }, [])

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would typically send the data to your backend
    console.log("Survey submitted:", {
      surveyId: surveyData?.id,
      answers: answers,
      submittedAt: new Date().toISOString(),
    })

    alert("Thank you! Your survey has been submitted successfully.")
    setSubmitting(false)
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "text":
      case "email":
        return (
          <Input
            type={question.type}
            placeholder={question.placeholder}
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="text-base"
            required={question.required}
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={question.placeholder}
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="min-h-[100px] text-base"
            required={question.required}
          />
        )

      case "radio":
        return (
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="space-y-2"
            required={question.required}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`radio-${question.id}-${index}`} />
                <Label htmlFor={`radio-${question.id}-${index}`} className="text-sm font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${question.id}-${index}`}
                  checked={answers[question.id]?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentAnswers = answers[question.id] || []
                    if (checked) {
                      handleAnswerChange(question.id, [...currentAnswers, option])
                    } else {
                      handleAnswerChange(
                        question.id,
                        currentAnswers.filter((item: string) => item !== option),
                      )
                    }
                  }}
                />
                <Label htmlFor={`checkbox-${question.id}-${index}`} className="text-sm font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "select":
        return (
          <Select
            value={answers[question.id] || ""}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            required={question.required}
          >
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "rating":
        const maxRating = question.maxRating || 5
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleAnswerChange(question.id, star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (answers[question.id] || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
            {answers[question.id] && (
              <span className="ml-3 text-sm text-muted-foreground">
                {answers[question.id]} out of {maxRating}
              </span>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
          </Card>
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="mb-4">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !surveyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Survey</CardTitle>
            <CardDescription>{error || "Unable to load survey data. Please try again later."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full" variant="destructive">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader className="border-l-4 border-l-primary">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold">{surveyData.title}</CardTitle>
              </div>
            </div>
            <CardDescription className="text-base text-muted-foreground">{surveyData.description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Survey Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {surveyData.questions.map((question, index) => (
            <Card key={question.id} className="shadow-sm">
              <CardHeader className="pb-4">
                <Label className="text-base font-medium flex items-start">
                  <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                  <span>{question.question}</span>
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </Label>
              </CardHeader>
              <CardContent className="pt-0">{renderQuestion(question)}</CardContent>
            </Card>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={submitting}
              className="px-8 py-3"
              size="lg"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {submitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            This form is powered by Forms •{" "}
            <a href="#" className="text-primary underline-offset-4 hover:underline">
              Report abuse
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
