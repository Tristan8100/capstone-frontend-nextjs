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

export function SurveyAnswerPage({ surveyId }: { surveyId: string | number }) {
  const router = useRouter()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [answers, setAnswers] = useState<Record<number, string | number | number[]>>({})


  useEffect(() => {
    if (!surveyId) return
    console.log('Fetching survey with ID:', surveyId)

    api2.get<Survey>(`/api/surveys/${surveyId}`)
      .then(res => {
        console.log('Survey fetched:', res.data)
        setSurvey(res.data)

        return api2.get<ResponseType | ResponseType[]>(`/api/responses/survey/${surveyId}`)
      })
      .then(resResp => {
        console.log('User response fetched:', resResp.data)
        const userResponse = Array.isArray(resResp.data) ? resResp.data[0] : resResp.data
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

        console.log('Mapped answers:', mappedAnswers)
        setAnswers(mappedAnswers)
      })
      .catch(err => {
        console.error('Failed to fetch survey or response:', err)
        setAnswers({})
      })
  }, [surveyId])

  const handleChange = (questionId: number, value: string | number, type: string) => {
    console.log(`Answer changed for question ${questionId}:`, value, 'type:', type)
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

    console.log('Submitting answers:', answers)

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

    console.log('Payload to submit:', payload)

    try {
      const res = await api2.post('/api/responses', payload)
      console.log('Submission response:', res.data)
      alert('Survey submitted successfully!')
      router.refresh()
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to submit survey.')
    }
  }

  if (!survey) return <p>Loading survey...</p>

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">{survey.title}</h1>
      <p className="text-muted-foreground">{survey.description}</p>

      {survey.questions.map(q => (
        <Card key={q.id}>
          <CardContent className="space-y-2 p-4">
            <p className="font-medium">{q.question_text}</p>

            {q.question_type === 'text' && (
              <Input
                type="text"
                value={(answers[q.id] as string) || ''}
                onChange={e => handleChange(q.id, e.target.value, 'text')}
              />
            )}

            {q.question_type === 'radio' && (
              <RadioGroup
                onValueChange={val => handleChange(q.id, val, 'radio')}
                value={answers[q.id] ? String(answers[q.id]) : ''}
              >
                {q.choices.map(choice => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(choice.id)} id={`q${q.id}-c${choice.id}`} />
                    <label htmlFor={`q${q.id}-c${choice.id}`}>{choice.choice_text}</label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {q.question_type === 'checkbox' && (
              <div className="space-y-2">
                {q.choices.map(choice => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`q${q.id}-c${choice.id}`}
                      checked={Array.isArray(answers[q.id]) && (answers[q.id] as number[]).includes(choice.id)}
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
