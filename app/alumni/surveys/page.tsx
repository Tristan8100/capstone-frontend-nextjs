import SurveysList from "@/components/surveys-list"

export default function Page() {
  return (
    <>
      {/* Main Content Grid */}
          <div className="flex justify-center">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Announcements */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Surveys</h2>
                <SurveysList />
              </div>
            </div>
          </div>
    </>
  )
}