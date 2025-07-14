import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { IdCard, Megaphone, MessageSquareText } from 'lucide-react'
import type { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent" id='features'>
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                        All-in-One Platform for Alumni Engagement
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Everything you need to stay connected—smart tools, real-time updates, and a growing community of graduates.
                    </p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    
                    {/* Alumni ID */}
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <IdCard className="size-6" aria-hidden />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">Alumni ID System</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                Each verified alumni gets a unique ID—your digital pass to connect, update records, and access exclusive features.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Announcements & Surveys */}
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Megaphone className="size-6" aria-hidden />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">Stay Informed</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="mt-3 text-sm">
                                Get the latest announcements and participate in surveys to have your voice heard in shaping alumni programs.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Alumni Feed */}
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <MessageSquareText className="size-6" aria-hidden />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">Alumni Feed</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="mt-3 text-sm">
                                Post updates, share milestones, and connect with fellow graduates in a dedicated social space built for you.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
        />
        <div
            aria-hidden
            className="bg-radial to-background absolute inset-0 from-transparent to-75%"
        />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
            {children}
        </div>
    </div>
)
