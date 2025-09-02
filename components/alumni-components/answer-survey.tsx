'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api2 } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Choice {
  id: number
  choice_text: string
}

interface Question {
  id: number
  question_text: string
  question_type: 'text' | 'radio' | 'checkbox'
  choices: Choice[]
}

interface Survey {
  id: number
  title: string
  description: string
  questions: Question[]
  has_responded: boolean
}

interface AnswerChoice {
  id: number
  answer_id: number
  choice_id: number
}

interface Answer {
  id: number
  response_id: number
  question_id: number
  answer_text: string | null
  answer_choices: AnswerChoice[]
}

interface ResponseType {
  id: number
  survey_id: number
  user_id: string
  answers: Answer[]
}

export function SurveyAnswerPage({ surveyId }: { surveyId: string | number }) {
  const router = useRouter()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [answers, setAnswers] = useState<Record<number, string | number | number[]>>({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!surveyId) return

    const fetchSurveyData = async () => {
      try {
        setFetching(true)
        setError(null)
        
        const surveyResponse = await api2.get<Survey>(`/api/surveys/${surveyId}`)
        setSurvey(surveyResponse.data)

        const responseResp = await api2.get<ResponseType | ResponseType[]>(`/api/responses/survey/${surveyId}`)
        
        const userResponse = Array.isArray(responseResp.data) ? responseResp.data[0] : responseResp.data
        if (!userResponse || !userResponse.answers) {
          setAnswers({})
          return
        }

        const mappedAnswers: Record<number, string | number[]> = {}
        userResponse.answers.forEach(ans => {
          if (ans.answer_choices && ans.answer_choices.length > 0) {
            mappedAnswers[ans.question_id] = ans.answer_choices.map(ac => ac.choice_id)
          } else if (ans.answer_text !== null) {
            mappedAnswers[ans.question_id] = ans.answer_text
          }
        })

        setAnswers(mappedAnswers)
      } catch (err) {
        console.error('Failed to fetch survey or response:', err)
        setError('Failed to load survey. Please try again.')
        toast.error('Failed to load survey')
      } finally {
        setFetching(false)
      }
    }

    fetchSurveyData()
  }, [surveyId])

  const handleChange = (questionId: number, value: string | number, type: string) => {
    if (type === 'checkbox') {
      setAnswers(prev => {
        const current = (prev[questionId] as number[]) || []
        if (current.includes(Number(value))) {
          return { ...prev, [questionId]: current.filter(v => v !== Number(value)) }
        } else {
          return { ...prev, [questionId]: [...current, Number(value)] }
        }
      })
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }))
    }
  }

  const handleSubmit = async () => {
    if (!survey) return

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
      const qid = Number(questionId)
      const question = survey.questions.find(q => q.id === qid)

      if (!question) return null

      if (question.question_type === 'checkbox' || question.question_type === 'radio') {
        let choiceIds: number[]
        if (Array.isArray(answer)) {
          choiceIds = answer.map(a => Number(a))
        } else {
          choiceIds = [Number(answer)]
        }
        return {
          question_id: qid,
          choice_ids: choiceIds,
        }
      } else {
        return {
          question_id: qid,
          answer_text: String(answer),
        }
      }
    }).filter(Boolean)

    const payload = {
      survey_id: survey.id,
      answers: formattedAnswers,
    }

    try {
      setLoading(true)
      const res = await api2.post<any>('/api/responses', payload)
      toast.success(res.data.message || 'Response submitted successfully!')
      router.refresh()
    } catch (error: any) {
      console.error('Submission error:', error)
      toast.error(error.response?.data?.message || 'Failed to submit response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const retryFetch = () => {
    setError(null)
    setFetching(true)
    // Trigger the useEffect again by updating a state that will re-run the fetch
    setSurvey(null)
    setTimeout(() => {
      const fetchSurveyData = async () => {
        try {
          const surveyResponse = await api2.get<Survey>(`/api/surveys/${surveyId}`)
          setSurvey(surveyResponse.data)
          setError(null)
        } catch (err) {
          setError('Failed to load survey. Please try again.')
        } finally {
          setFetching(false)
        }
      }
      fetchSurveyData()
    }, 0)
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={retryFetch} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  if (fetching || !survey) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
        
        <Skeleton className="h-10 w-32" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{survey.title}</h1>
      <p className="text-muted-foreground">{survey.description}</p>
      
      {survey.has_responded && (
        <Alert className="bg-primary/10 border-primary text-foreground">
          <AlertTitle>Response Saved</AlertTitle>
          <AlertDescription>
            Your previous response has been saved. You can update your answers below.
          </AlertDescription>
        </Alert>
      )}

      {survey.questions.map(q => (
        <Card key={q.id} className="border-border">
          <CardContent className="space-y-4 p-6">
            <p className="font-medium text-foreground">{q.question_text}</p>

            {q.question_type === 'text' && (
              <Input
                type="text"
                value={(answers[q.id] as string) || ''}
                onChange={e => handleChange(q.id, e.target.value, 'text')}
                className="border-border bg-background text-foreground"
              />
            )}

            {q.question_type === 'radio' && (
              <RadioGroup
                onValueChange={val => handleChange(q.id, val, 'radio')}
                value={answers[q.id] ? String(answers[q.id]) : ''}
                className="space-y-3"
              >
                {q.choices.map(choice => (
                  <div key={choice.id} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={String(choice.id)} 
                      id={`q${q.id}-c${choice.id}`}
                      className="text-primary border-border"
                    />
                    <label 
                      htmlFor={`q${q.id}-c${choice.id}`}
                      className="text-foreground cursor-pointer"
                    >
                      {choice.choice_text}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {q.question_type === 'checkbox' && (
              <div className="space-y-3">
                {q.choices.map(choice => (
                  <div key={choice.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`q${q.id}-c${choice.id}`}
                      checked={Array.isArray(answers[q.id]) && (answers[q.id] as number[]).includes(choice.id)}
                      onCheckedChange={() => handleChange(q.id, choice.id, 'checkbox')}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <label 
                      htmlFor={`q${q.id}-c${choice.id}`}
                      className="text-foreground cursor-pointer"
                    >
                      {choice.choice_text}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button 
        onClick={handleSubmit} 
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Response"
        )}
      </Button>
    </div>
  )
}