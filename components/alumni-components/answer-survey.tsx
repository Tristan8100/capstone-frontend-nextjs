'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api2 } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

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

export function SurveyAnswerPage({ surveyId }: { surveyId: any }) {
  const router = useRouter()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [answers, setAnswers] = useState<Record<number, any>>({}) // question_id -> answer(s)

  useEffect(() => {
    if (!surveyId) return

    console.log('Survey ID:', surveyId)

    // Fetch survey
    api2.get<Survey>(`/api/surveys/${surveyId}`)
      .then(res => {
        setSurvey(res.data)

        // Fetch user's existing response (if any)
        return api2.get<ResponseType>(`/api/responses/survey/${surveyId}`)
      })
      .then(resResp => {
  // handle array response gracefully
  const userResponse = Array.isArray(resResp.data) ? resResp.data[0] : resResp.data

  console.log('User response:', userResponse)

  if (!userResponse || !userResponse.answers) {
    setAnswers({})
    return
  }

  const mappedAnswers: Record<number, any> = {}

  userResponse.answers.forEach(ans => {
    if (ans.answer_choices && ans.answer_choices.length > 0) {
      mappedAnswers[ans.question_id] = ans.answer_choices.map(ac => ac.choice_id)
    } else if (ans.answer_text !== null) {
      mappedAnswers[ans.question_id] = String(ans.answer_text)
    }
  })

  setAnswers(mappedAnswers)
})

      .catch(() => {
        setAnswers({})
      })
  }, [surveyId])

  const handleChange = (questionId: number, value: any, type: string) => {
    if (type === 'checkbox') {
      setAnswers(prev => {
        const current = prev[questionId] || []
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter((v: any) => v !== value) }
        } else {
          return { ...prev, [questionId]: [...current, value] }
        }
      })
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }))
    }
  }

  const handleSubmit = async () => {
    // Format answers for backend
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
      const base = { question_id: Number(questionId) }

      if (Array.isArray(answer)) {
        return { ...base, choice_ids: answer }
      } else {
        return { ...base, answer_text: String(answer) }
      }
    })

    const payload = {
      survey_id: surveyId,
      answers: formattedAnswers,
    }

    console.log('Submitting this payload:', payload)

    try {
      const res = await api2.post('/api/responses', payload)
      console.log(res.data)
      alert('Survey submitted successfully!')
      // Optionally: router.push or refresh
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to submit survey. Please try again.')
    }
  }

  if (!survey) return <p>Loading survey...</p>

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">{survey.title}</h1>
      <p className="text-muted-foreground">{survey.description}</p>

      {survey.questions.map((q) => (
        <Card key={q.id}>
          <CardContent className="p-4 space-y-2">
            <p className="font-medium">{q.question_text}</p>

            {q.question_type === 'text' && (
              <Input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value, 'text')}
              />
            )}

            {q.question_type === 'radio' && (
              <RadioGroup
                onValueChange={(value) => handleChange(q.id, value, 'radio')}
                value={answers[q.id] ? String(answers[q.id]) : ''}
              >
                {q.choices.map((choice) => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(choice.id)} id={`q${q.id}-c${choice.id}`} />
                    <label htmlFor={`q${q.id}-c${choice.id}`}>{choice.choice_text}</label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {q.question_type === 'checkbox' && (
              <div className="space-y-2">
                {q.choices.map((choice) => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`q${q.id}-c${choice.id}`}
                      checked={answers[q.id]?.includes(choice.id) || false}
                      onCheckedChange={() => handleChange(q.id, choice.id, 'checkbox')}
                    />
                    <label htmlFor={`q${q.id}-c${choice.id}`}>{choice.choice_text}</label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleSubmit} className="mt-4">
        Submit
      </Button>
    </div>
  )
}
