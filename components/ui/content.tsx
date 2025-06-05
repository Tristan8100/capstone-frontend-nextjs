import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32" id='about'>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <img
                    className="rounded-(--radius) grayscale"
                    src="static/alumni2.jpg"
                    alt="team image"
                    height=""
                    width=""
                    loading="lazy"
                />

                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-medium">The <span className='text-primary font-bold'>BTECHLINK</span> community brings together our <span className='text-primary font-bold'>BTECH</span> alumnis</h2>
                    <div className="space-y-6">
                        <p>Lyra is evolving to be more than just the models. It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.</p>

                    </div>
                </div>
            </div>
        </section>
    )
}