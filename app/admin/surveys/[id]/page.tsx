"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit2, Save, X } from "lucide-react"

interface Choice {
  id: string
  text: string
}

interface Question {
  id: string
  title: string
  type: "text" | "textarea" | "radio" | "checkbox" | "select"
  required: boolean
  choices?: Choice[]
  createdAt: string
}

// Fake API functions
const api = {
  async createQuestion(question: Omit<Question, "id" | "createdAt">): Promise<Question> {
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network delay
    const newQuestion: Question = {
      ...question,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    return newQuestion
  },

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    // Simulate fetching and updating
    const updatedQuestion: Question = {
      id,
      title: updates.title || "Updated Question",
      type: updates.type || "text",
      required: updates.required || false,
      choices: updates.choices || [],
      createdAt: new Date().toISOString(),
    }
    return updatedQuestion
  },

  async deleteQuestion(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    // Simulate deletion
  },

  async fetchQuestions(): Promise<Question[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Return some sample data
    return [
      {
        id: "1",
        title: "What is your name?",
        type: "text",
        required: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Choose your favorite color",
        type: "radio",
        required: false,
        choices: [
          { id: "c1", text: "Red" },
          { id: "c2", text: "Blue" },
          { id: "c3", text: "Green" },
        ],
        createdAt: new Date().toISOString(),
      },
    ]
  },
}

export default function FormBuilder() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewQuestion, setShowNewQuestion] = useState(false)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const fetchedQuestions = await api.fetchQuestions()
      setQuestions(fetchedQuestions)
    } catch (error) {
      console.error("Failed to load questions:", error)
      alert("Failed to load questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionCreated = (newQuestion: Question) => {
    setQuestions((prev) => [...prev, newQuestion])
    setShowNewQuestion(false)
  }

  const handleQuestionUpdated = (updatedQuestion: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)))
  }

  const handleQuestionDeleted = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId))
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading form builder...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Form Builder</h1>
        <p className="text-muted-foreground">Create and manage your form questions</p>
      </div>

      <div className="space-y-6">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onUpdate={handleQuestionUpdated}
            onDelete={handleQuestionDeleted}
          />
        ))}

        {showNewQuestion ? (
          <NewQuestionForm onSave={handleQuestionCreated} onCancel={() => setShowNewQuestion(false)} />
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8">
              <Button onClick={() => setShowNewQuestion(true)} variant="ghost" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function QuestionCard({
  question,
  onUpdate,
  onDelete,
}: {
  question: Question
  onUpdate: (question: Question) => void
  onDelete: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      setLoading(true)
      await api.deleteQuestion(question.id)
      onDelete(question.id)
      console.log("Question deleted successfully")
    } catch (error) {
      console.error("Failed to delete question:", error)
      alert("Failed to delete question. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (updatedQuestion: Question) => {
    try {
      setLoading(true)
      const result = await api.updateQuestion(question.id, updatedQuestion)
      onUpdate(result)
      setIsEditing(false)
      console.log("Question updated successfully")
    } catch (error) {
      console.error("Failed to update question:", error)
      alert("Failed to update question. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <EditQuestionForm
        question={question}
        onSave={handleUpdate}
        onCancel={() => setIsEditing(false)}
        loading={loading}
      />
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">{question.title}</CardTitle>
          {question.required && <Badge variant="secondary">Required</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{question.type}</Badge>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} disabled={loading}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <QuestionPreview question={question} />
      </CardContent>
    </Card>
  )
}

function NewQuestionForm({
  onSave,
  onCancel,
}: {
  onSave: (question: Question) => void
  onCancel: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (questionData: Omit<Question, "id" | "createdAt">) => {
    try {
      setLoading(true)
      const newQuestion = await api.createQuestion(questionData)
      onSave(newQuestion)
      console.log("Question created successfully")
    } catch (error) {
      console.error("Failed to create question:", error)
      alert("Failed to create question. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Question</CardTitle>
      </CardHeader>
      <CardContent>
        <QuestionForm onSubmit={handleSubmit} onCancel={onCancel} loading={loading} />
      </CardContent>
    </Card>
  )
}

function EditQuestionForm({
  question,
  onSave,
  onCancel,
  loading,
}: {
  question: Question
  onSave: (question: Question) => void
  onCancel: () => void
  loading: boolean
}) {
  const handleSubmit = (questionData: Omit<Question, "id" | "createdAt">) => {
    onSave({
      ...questionData,
      id: question.id,
      createdAt: question.createdAt,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Question</CardTitle>
      </CardHeader>
      <CardContent>
        <QuestionForm initialData={question} onSubmit={handleSubmit} onCancel={onCancel} loading={loading} />
      </CardContent>
    </Card>
  )
}

function QuestionForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: {
  initialData?: Question
  onSubmit: (data: Omit<Question, "id" | "createdAt">) => void
  onCancel: () => void
  loading: boolean
}) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [type, setType] = useState<Question["type"]>(initialData?.type || "text")
  const [required, setRequired] = useState(initialData?.required || false)
  const [choices, setChoices] = useState<Choice[]>(initialData?.choices || [])

  const needsChoices = ["radio", "checkbox", "select"].includes(type)

  const addChoice = () => {
    const newChoice: Choice = {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
    }
    setChoices([...choices, newChoice])
  }

  const updateChoice = (id: string, text: string) => {
    setChoices(choices.map((choice) => (choice.id === id ? { ...choice, text } : choice)))
  }

  const removeChoice = (id: string) => {
    setChoices(choices.filter((choice) => choice.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Question title is required")
      return
    }

    if (needsChoices && choices.filter((c) => c.text.trim()).length < 2) {
      alert("At least 2 choices are required for this question type")
      return
    }

    onSubmit({
      title: title.trim(),
      type,
      required,
      choices: needsChoices ? choices.filter((c) => c.text.trim()) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Question Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your question..."
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Question Type</Label>
        <Select value={type} onValueChange={(value: Question["type"]) => setType(value)} disabled={loading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text Input</SelectItem>
            <SelectItem value="textarea">Long Text</SelectItem>
            <SelectItem value="radio">Single Choice</SelectItem>
            <SelectItem value="checkbox">Multiple Choice</SelectItem>
            <SelectItem value="select">Dropdown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="required"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
          disabled={loading}
          className="rounded border-gray-300"
        />
        <Label htmlFor="required">Required field</Label>
      </div>

      {needsChoices && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Choices</Label>
            <Button type="button" variant="outline" size="sm" onClick={addChoice} disabled={loading}>
              <Plus className="h-4 w-4 mr-1" />
              Add Choice
            </Button>
          </div>
          <div className="space-y-2">
            {choices.map((choice, index) => (
              <div key={choice.id} className="flex items-center gap-2">
                <Input
                  value={choice.text}
                  onChange={(e) => updateChoice(choice.id, e.target.value)}
                  placeholder={`Choice ${index + 1}`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeChoice(choice.id)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Question
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function QuestionPreview({ question }: { question: Question }) {
  switch (question.type) {
    case "text":
      return <Input placeholder="Text input preview" disabled />

    case "textarea":
      return <Textarea placeholder="Long text input preview" disabled />

    case "radio":
      return (
        <div className="space-y-2">
          {question.choices?.map((choice) => (
            <div key={choice.id} className="flex items-center space-x-2">
              <input type="radio" disabled />
              <span>{choice.text}</span>
            </div>
          ))}
        </div>
      )

    case "checkbox":
      return (
        <div className="space-y-2">
          {question.choices?.map((choice) => (
            <div key={choice.id} className="flex items-center space-x-2">
              <input type="checkbox" disabled />
              <span>{choice.text}</span>
            </div>
          ))}
        </div>
      )

    case "select":
      return (
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {question.choices?.map((choice) => (
              <SelectItem key={choice.id} value={choice.id}>
                {choice.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    default:
      return null
  }
}
