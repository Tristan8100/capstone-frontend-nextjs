"use client";

import { TextEffect } from '@/components/ui/text-effect';
import { Tilt } from '@/components/ui/tilt';
import { HeroHeader } from '@/components/header';
import HeroSection from '@/components/hero-section';
import { Spotlight } from '@/components/ui/spotlight';
import Features from '@/components/ui/features';
import ContentSection from '@/components/ui/content';
import FooterSection from '@/components/footer';
import { InViewImagesGrid } from '@/components/scroll-view';
import TeamSection from '@/components/team';
import FAQsTwo from '@/components/faq';
import { ModeToggle } from '@/components/mode-toggle';
function Home() {

  return (
    <>
      <HeroHeader />
      <HeroSection/>
      <Features/>
      <InViewImagesGrid/>
      <TeamSection/>
      <ContentSection/>
      <FAQsTwo/>
      <FooterSection/>
    </>
  )
}

export default Home