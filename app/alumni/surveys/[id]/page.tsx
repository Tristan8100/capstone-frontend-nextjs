import SurveysList from "@/components/surveys-list"
import SurveyForm from "@/components/survey-form"
import AlumniLayout from "@/components/layout/alumni-layout"

export default function Page() {
  return (
    <AlumniLayout currentPage="Surveys">
        <h2 className="text-xl font-semibold">Surveys</h2>
        <SurveyForm />
    </AlumniLayout>
  )
}