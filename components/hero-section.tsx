import React from 'react'
import  Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { TextEffect } from './ui/text-effect'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <>
            <main className="overflow-x-hidden" id="home">
                <main>
                <section className="overflow-hidden">
                    <div className="relative mx-auto px-6 py-28 lg:py-20 w-[80%] border">
                        <div className="lg:flex lg:items-center lg:gap-12 mt-12">
                            <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">

                                <TextEffect per='char' preset='fade' className="mt-10 text-balance text-4xl font-bold md:text-5xl xl:text-5xl">Welcome to BTECHLINK</TextEffect>
                                <TextEffect className="mt-8">Your gateway for staying connected beyond success. Explore alumni profiles, discover success stories, and stay in touch with the community that shaped your journey.</TextEffect>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="px-5 text-base">
                                        <Link href="#link">
                                            <span className="text-nowrap">Find My Profile</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="px-5 text-base">
                                        <Link href="/login">
                                            <span className="text-nowrap">Login</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3">
                            <div className="relative">
                                <div className="bg-radial-[at_65%_25%] to-background z-1 -inset-17 absolute from-transparent to-40%"></div>
                                <Image
                                    className="hidden dark:block"
                                    src="/static/alumni.jpg"
                                    alt="app illustration"
                                    width={2796}
                                    height={2008}
                                />
                                <Image
                                    className="dark:hidden"
                                    src="/static/alumni.jpg"
                                    alt="app illustration"
                                    width={2796}
                                    height={2008}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                </main>
                <section className="bg-background">
                    <div className="group relative m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm">College Institutes</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-[50px] w-fit dark:invert"
                                            src="/static/TSBA Logo.png"
                                            alt="Alumni"
                                            height={50}
                                            width={50}
                                            style={{ width: 'auto', height: '50px' }}
                                        />
                                    </div>

                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-[50px] w-fit dark:invert"
                                            src="/static/informationtechnology.png"
                                            alt="IT"
                                            height={50}
                                            width={50}
                                            style={{ width: 'auto', height: '50px' }}
                                        />
                                    </div>

                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-[50px] w-fit dark:invert"
                                            src="/static/shs.png"
                                            alt="shs"
                                            height={50}
                                            width={50}
                                            style={{ width: 'auto', height: '50px' }}
                                        />
                                    </div>

                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-[50px] w-fit dark:invert"
                                            src="/static/artsandsciences.png"
                                            alt="arts and sciences"
                                            height={50}
                                            width={50}
                                            style={{ width: 'auto', height: '50px' }}
                                        />
                                    </div>

                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-[50px] w-fit dark:invert"
                                            src="/static/businessandaccountancy.png"
                                            alt="business and accountancy"
                                            height={50}
                                            width={50}
                                            style={{ width: 'auto', height: '50px' }}
                                        />
                                    </div>

                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-[50px] w-fit dark:invert"
                                            src="/static/education.png"
                                            alt="education"
                                            height={50}
                                            width={50}
                                            style={{ width: 'auto', height: '50px' }}
                                        />
                                    </div>

                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-[50px] w-fit dark:invert"
                                            src="/static/hmtm.png"
                                            alt="hmtm"
                                            height={50}
                                            width={50}
                                            style={{ width: 'auto', height: '50px' }}
                                        />
                                    </div>

                                </InfiniteSlider>

                                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}