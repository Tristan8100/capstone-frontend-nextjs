'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'


export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How do I get my Alumni ID?',
            answer: 'After signing up and verifying your information, your Alumni ID will be generated automatically. You can view and download it from your profile page.',
        },
        {
            id: 'item-2',
            question: 'Can I update my personal or academic information?',
            answer: 'Yes. Once logged in, go to your profile and click the "Edit" button. You can update your name, contact details, course, batch, and more.',
        },
        {
            id: 'item-3',
            question: 'How will I receive announcements or survey invitations?',
            answer: 'Announcements will appear on your dashboard, and survey invitations may also be sent to your registered email. Make sure your contact info is up to date.',
        },
        {
            id: 'item-4',
            question: 'Is this platform only for graduates of BTECH?',
            answer: 'Yes. BTECHLINK is exclusively for BTECH alumni. All sign-ups are subject to verification before gaining full access.',
        },
        {
            id: 'item-5',
            question: 'Is my data safe and private?',
            answer: 'Absolutely. We prioritize data privacy and security. Your information is only visible to authorized personnel and is never shared without your consent.',
        },
    ]


    return (
        <section className="py-16 md:py-24" id='faqs'>
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}