import Image from "next/image"

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32" id='about'>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <Image
                    className="rounded-(--radius) ml-auto"
                    src="/static/alumni2.jpg"
                    alt="team image"
                    height={400}
                    width={600}
                    loading="lazy"
                />

                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <div>
                        <div className="text-4xl font-medium">The <span className='text-primary font-bold'>BTECHLINK</span> community brings together our <span className='text-primary font-bold'>BTECH</span> alumnis </div>
                        <div className="space-y-6 mt-4">
                        <p>
                            BTECHLINK is a digital bridge connecting graduates of BTECH with each other and with the institution that shaped their journey. Whether you&rsquo;re here to update your alumni ID, read announcements, participate in surveys, or share your latest achievement &mdash; we&rsquo;ve built this platform to keep you involved, informed, and inspired.
                        </p>
                        <p>
                            We believe alumni are not just part of the past &mdash; you&rsquo;re part of our future. Let&rsquo;s continue growing the BTECH legacy, together.
                        </p>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    )
}