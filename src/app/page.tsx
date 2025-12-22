import Header from '@/components/header'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import AboutSection from '@/components/about-section'
import SkillsSection from '@/components/skills-section'
import ExperienceSection from '@/components/experience-section'
import ProjectsSection from '@/components/projects-section'

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col font-body bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark overflow-x-clip">
      <Header />
      <main className="flex-1 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section id="home" className="mb-12 sm:mb-16 md:mb-20">
            <HeroSection />
          </section>
          <section id="about" className="mb-12 sm:mb-16 md:mb-20">
            <AboutSection />
          </section>
          <section id="experience" className="mb-12 sm:mb-16 md:mb-20">
            <ExperienceSection />
          </section>
          <section id="skills" className="mb-12 sm:mb-16 md:mb-20">
            <SkillsSection />
          </section>
        </div>
        <section id="projects">
          <ProjectsSection />
        </section>
      </main>
      <Footer />
    </div>
  )
}