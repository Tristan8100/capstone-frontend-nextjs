"use client";
import { HeroHeader } from '@/components/header';
import HeroSection from '@/components/hero-section';
import Features from '@/components/ui/features';
import ContentSection from '@/components/ui/content';
import FooterSection from '@/components/footer';
import { InViewImagesGrid } from '@/components/scroll-view';
import TeamSection from '@/components/team';
import FAQsTwo from '@/components/faq';
import { HowToJoin } from '@/components/how-to-join';
import { PWAStatus } from '@/components/pwa-status';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';

function Home() {

  return (
    <>
      <HeroHeader />
      <PWAStatus/>
      <PWAInstallPrompt/>
      <HeroSection/>
      <Features/>
      <InViewImagesGrid/>
      <ContentSection/>
      <HowToJoin/>
      <FAQsTwo/>
      <FooterSection/>
    </>
  )
}

export default Home