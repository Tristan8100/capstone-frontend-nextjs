'use client'

import { SurveyAnswerPage } from "@/components/alumni-components/answer-survey";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id; // assuming your route is /alumni/survey/[id]

  return <SurveyAnswerPage surveyId={id} />;
}