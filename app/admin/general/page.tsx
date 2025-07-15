
import { CoursesTable } from "@/components/admin-components/course-table"
import { InstitutesTable } from "@/components/admin-components/institute-table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


export default function Page() {
  return (
    <>
      <div className="p-4">
        <Tabs defaultValue="courses">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">General</h1>
            <TabsList>
              <TabsTrigger value="courses">Program</TabsTrigger>
              <TabsTrigger value="institutes">Institutes</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="courses"><CoursesTable /></TabsContent>
          <TabsContent value="institutes"><InstitutesTable /></TabsContent>
        </Tabs>
      </div>
    </>
  );
}