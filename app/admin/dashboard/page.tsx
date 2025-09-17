import AccountAnalytics from "@/components/analytics/account-analytics"
import AlumniAnalytics from "@/components/analytics/alumni-analytics"
import InstituteAnalytics from "@/components/analytics/institute-analytics"
import PostAnalytics from "@/components/analytics/post-analytics"
import SurveyAnalytics from "@/components/analytics/survey-analytics"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function Page() {

  return (
    <div className="p-4">
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger className="text-xs md:text-sm" value="posts">
            Posts
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="alumni-List">
            Alumni-List
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="account">
            Accounts
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="institutes">
            Institutes
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="surveys">
            Surveys
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <PostAnalytics />
        </TabsContent>
        <TabsContent value="alumni-List">
          <AlumniAnalytics />
        </TabsContent>
        <TabsContent value="account">
          <AccountAnalytics />
        </TabsContent>
        <TabsContent value="institutes">
          <InstituteAnalytics />
        </TabsContent>
        <TabsContent value="surveys">
          <SurveyAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}