import React, { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Check } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EducationSection } from './components/EducationSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { downloadResumePdf } from './utils/resumePdf';

export default function App() {
  const [resumeToast, setResumeToast] = useState(false);

  const handleDownloadResume = () => {
    downloadResumePdf();
    setResumeToast(true);
    window.setTimeout(() => setResumeToast(false), 3200);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#080812] text-[#F4F4FA]">
        <Navbar onDownloadResume={handleDownloadResume} />

        <main>
          <HeroSection onDownloadResume={handleDownloadResume} />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <EducationSection />
          <AchievementsSection />
          <ContactSection />
        </main>

        <Footer />

        {/* Subtle confirmation toast on resume download */}
        {resumeToast && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-sky-400/40 bg-[#0d1022] px-4 py-3 text-xs font-medium text-white shadow-xl"
          >
            <Check className="h-4 w-4 text-sky-400 shrink-0" aria-hidden="true" />
            <span>Downloaded Ch_Thrimurthi_Resume.pdf</span>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
