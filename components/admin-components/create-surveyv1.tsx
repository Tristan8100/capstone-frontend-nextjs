"use client" // This page needs to be a client component

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save } from "lucide-react"
import { api2 } from "@/lib/api" // Import api2 directly
import { useParams } from 'next/navigation'
// Type definitions for Survey, Question, and Choice
type Choice = {
  id?: number
  choice_text: string
}

type Question = {
  id?: number
  question_text: string
  question_type: "text" | "radio" | "checkbox"
  choices?: Choice[]
}

type Survey = {
  id?: number
  title: string
  description: string
  questions: Question[]
}

// The main page component, now containing all the SurveyBuilder logic
export default function AdminSurveyEditPage() {
  // Extract the surveyId from the route parameters
  const params = useParams();
  const surveyId = parseInt(params.id as string, 10);

  const [survey, setSurvey] = useState<Survey>({
    title: "",
    description: "",
    questions: [],
  })

  // Effect to fetch survey data when surveyId changes
  useEffect(() => {
    if (surveyId) {
      api2
        .get<Survey>(`/api/surveys/${surveyId}`)
        .then((res) => {
          const data = res.data
          setSurvey({
            id: data.id,
            title: data.title,
            description: data.description,
            questions: data.questions.map((q: any) => ({
              id: q.id,
              question_text: q.question_text,
              question_type: q.question_type,
              choices: q.choices || [],
            })),
          })
        })
        .catch((error) => {
          console.error("Error fetching survey:", error)
          alert("Failed to load survey for editing.")
        })
    }
  }, [surveyId])

  // Handlers for survey data changes
  const handleSurveyChange = (key: keyof Survey, value: any) => {
    setSurvey((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddQuestion = () => {
    setSurvey((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_text: "",
          question_type: "text",
          choices: [],
        },
      ],
    }))
  }

  const handleDeleteQuestion = (index: number) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const handleQuestionChange = <K extends keyof Question>(
    index: number,
    key: K,
    value: Question[K]
  ) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[index][key] = value
    setSurvey((prev) => ({ ...prev, questions: updatedQuestions }))
  }

  const handleAddChoice = (questionIndex: number) => {
    const updatedQuestions = [...survey.questions]
    const question = updatedQuestions[questionIndex]
    if (!question.choices) question.choices = []
    question.choices.push({ choice_text: "" })
    setSurvey((prev) => ({ ...prev, questions: updatedQuestions }))
  }

  const handleChoiceChange = (questionIndex: number, choiceIndex: number, value: string) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[questionIndex].choices![choiceIndex].choice_text = value
    setSurvey((prev) => ({ ...prev, questions: updatedQuestions }))
  }

  const handleDeleteChoice = (questionIndex: number, choiceIndex: number) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[questionIndex].choices!.splice(choiceIndex, 1)
    setSurvey((prev) => ({ ...prev, questions: updatedQuestions }))
  }

  // Handler for form submission
  const handleSubmit = async () => {
    const payload = {
      title: survey.title,
      description: survey.description,
      questions: survey.questions.map((q) => ({
        question_text: q.question_text,
        question_type: q.question_type,
        choices: q.choices?.map((c) => ({
          choice_text: c.choice_text,
        })),
      })),
    }

    console.log("Payload being sent:", payload) // Log the payload to verify its structure

    try {
      if (survey.id) {
        await api2.put(`/api/surveys/store-or-update/${survey.id}`, payload)
        alert("Survey updated!")
      } else {
        await api2.post("/api/surveys/store-or-update", payload)
        alert("Survey created!")
      }
    } catch (error) {
      console.error("Error submitting survey:", error)
      alert("Failed to submit survey. Check console for details.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{survey.id ? "Edit Survey" : "Create Survey"}</h1>
      <div className="space-y-2">
        <Label htmlFor="survey-title">Title</Label>
        <Input id="survey-title" value={survey.title} onChange={(e) => handleSurveyChange("title", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="survey-description">Description</Label>
        <Textarea
          id="survey-description"
          value={survey.description}
          onChange={(e) => handleSurveyChange("description", e.target.value)}
        />
      </div>
      <div className="space-y-6">
        {survey.questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded space-y-3">
            <div className="flex justify-between">
              <Label>{`Question ${qIndex + 1}`}</Label>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(qIndex)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Input
              value={q.question_text}
              onChange={(e) => handleQuestionChange(qIndex, "question_text", e.target.value)}
              placeholder="Question text..."
            />
            <select
              value={q.question_type}
              onChange={(e) =>
                handleQuestionChange(qIndex, "question_type", e.target.value as Question["question_type"])
              }
              className="w-full border rounded p-2"
            >
              <option value="text">Text</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
            </select>
            {(q.question_type === "radio" || q.question_type === "checkbox") && (
              <div className="space-y-2">
                <Label>Choices</Label>
                {q.choices?.map((choice, cIndex) => (
                  <div key={cIndex} className="flex gap-2 items-center">
                    <Input
                      value={choice.choice_text}
                      onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                      placeholder={`Choice ${cIndex + 1}`}
                    />
                    <Button type="button" size="sm" variant="ghost" onClick={() => handleDeleteChoice(qIndex, cIndex)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="outline" onClick={() => handleAddChoice(qIndex)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Choice
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={handleAddQuestion}>
        <Plus className="w-4 h-4 mr-1" /> Add Question
      </Button>
      <Button onClick={handleSubmit} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        {survey.id ? "Update Survey" : "Create Survey"}
      </Button>
    </div>
  )
}
