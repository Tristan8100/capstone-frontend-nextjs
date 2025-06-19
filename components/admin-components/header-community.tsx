import { Users, MessageSquare, Heart } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
export default function HeaderCommunity({currentPage} : {currentPage: string}) {
    return (
        <>
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">{currentPage}</h1>
                <p className="text-muted-foreground">Connect with fellow alumni and share your experiences</p>
              </div>
            </div>

            <Separator/>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                    <p className="text-2xl font-bold">2,847</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                    <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Posts Today</p>
                    <p className="text-2xl font-bold">127</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                    <Heart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Interactions</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                </CardContent>
              </Card>
            </div>

        </>
    );
}