"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save } from "lucide-react"
import { api2 } from "@/lib/api"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

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

export default function AdminSurveyEditPage() {
  const params = useParams()
  const surveyId = parseInt(params.id as string, 10)

  const [survey, setSurvey] = useState<Survey>({
    title: "",
    description: "",
    questions: [],
  })

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
          alert("Failed to load survey.")
        })
    }
  }, [surveyId])

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
  const updated = [...survey.questions];
  updated[index][key] = value;
  setSurvey((prev) => ({ ...prev, questions: updated }));
};


  const handleAddChoice = (qIndex: number) => {
    const updated = [...survey.questions]
    if (!updated[qIndex].choices) updated[qIndex].choices = []
    updated[qIndex].choices!.push({ choice_text: "" })
    setSurvey((prev) => ({ ...prev, questions: updated }))
  }

  const handleChoiceChange = (qIndex: number, cIndex: number, value: string) => {
    const updated = [...survey.questions]
    updated[qIndex].choices![cIndex].choice_text = value
    setSurvey((prev) => ({ ...prev, questions: updated }))
  }

  const handleDeleteChoice = (qIndex: number, cIndex: number) => {
    const updated = [...survey.questions]
    updated[qIndex].choices!.splice(cIndex, 1)
    setSurvey((prev) => ({ ...prev, questions: updated }))
  }

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

    try {
      if (survey.id) {
        await api2.put(`/api/surveys/store-or-update/${survey.id}`, payload)
        alert("Survey updated!")
      } else {
        await api2.post("/api/surveys/store-or-update", payload)
        alert("Survey created!")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to submit survey.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">{survey.id ? "Edit Survey" : "Create Survey"}</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="survey-title">Title</Label>
          <Input
            id="survey-title"
            value={survey.title}
            onChange={(e) => handleSurveyChange("title", e.target.value)}
            placeholder="Enter survey title"
          />
        </div>
        <div>
          <Label htmlFor="survey-description">Description</Label>
          <Textarea
            id="survey-description"
            value={survey.description ?? ""}
            onChange={(e) => handleSurveyChange("description", e.target.value)}
            placeholder="Describe this survey..."
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {survey.questions.map((q, qIndex) => (
          <Card key={qIndex}>
            <CardHeader className="flex flex-row justify-between items-center">
              <h2 className="font-semibold text-lg">Question {qIndex + 1}</h2>
              <Button size="icon" variant="destructive" onClick={() => handleDeleteQuestion(qIndex)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Question Text</Label>
                <Input
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(qIndex, "question_text", e.target.value)}
                  placeholder="Enter your question"
                />
              </div>
              <div>
                <Label>Question Type</Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={q.question_type}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "question_type", e.target.value as Question["question_type"])
                  }
                >
                  <option value="text">Text</option>
                  <option value="radio">Multiple Choice (Radio)</option>
                  <option value="checkbox">Multiple Choice (Checkbox)</option>
                </select>
              </div>

              {(q.question_type === "radio" || q.question_type === "checkbox") && (
                <div className="space-y-2">
                  <Label>Choices</Label>
                  {q.choices?.map((c, cIndex) => (
                    <div key={cIndex} className="flex gap-2 items-center">
                      <Input
                        value={c.choice_text}
                        onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                        placeholder={`Choice ${cIndex + 1}`}
                      />
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteChoice(qIndex, cIndex)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => handleAddChoice(qIndex)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Choice
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center gap-4 pt-4">
        <Button variant="outline" onClick={handleAddQuestion}>
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
        <Button onClick={handleSubmit} className="ml-auto">
          <Save className="w-4 h-4 mr-2" />
          {survey.id ? "Update Survey" : "Create Survey"}
        </Button>
      </div>
    </div>
  )
}
