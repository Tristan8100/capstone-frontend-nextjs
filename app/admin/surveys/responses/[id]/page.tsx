'use client'

import { useEffect, useState } from 'react'
import { api2 } from '@/lib/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

type Choice = {
  id: number
  text: string
  response_count: number
}

type Question = {
  id: number
  question_text: string
  question_type: 'radio' | 'checkbox' | 'text'
  choices?: Choice[]
  response_count?: number
}

type SurveyResult = {
  survey_id: number
  title: string
  description: string
  results: Question[]
}

export default function SurveyChart() {
  const [survey, setSurvey] = useState<SurveyResult | null>(null)
  const params = useParams()
  const surveyId = parseInt(params.id as string, 10)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api2.get<SurveyResult>(`/api/surveys/results/${surveyId}`)
        setSurvey(res.data)
      } catch (error) {
        console.error('Error fetching survey data:', error)
      }
    }

    fetchData()
  }, [surveyId])

  if (!survey) return <div>Loading...</div>

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{survey.title}</h1>
      <p className="text-muted-foreground">{survey.description}</p>

      <Separator/>

      {survey.results.map((question) => (
        <Card key={question.id}>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">{question.question_text}</h2>

            {(question.question_type === 'radio' || question.question_type === 'checkbox') &&
            question.choices ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={question.choices.map((choice) => ({
                    name: choice.text,
                    responses: choice.response_count,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="responses" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            ) : question.question_type === 'text' ? (
              <p className="text-muted-foreground italic">
                Text responses do not have analytics.
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
