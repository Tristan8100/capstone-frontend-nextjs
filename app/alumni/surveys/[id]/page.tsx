'use client'

import { SurveyAnswerPage } from "@/components/alumni-components/answer-survey";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams()
  let id = params.id

  // If id is an array, get first element
  if (Array.isArray(id)) id = id[0]

  return <SurveyAnswerPage surveyId={id || ''}/>;
}