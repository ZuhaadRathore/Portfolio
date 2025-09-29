import Header from '@/components/header'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import AboutSection from '@/components/about-section'
import SkillsSection from '@/components/skills-section'
import ProjectsSection from '@/components/projects-section'

export default function Home() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col font-body bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Header />
      <main className="container mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <section id="home">
          <HeroSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="skills">
          <SkillsSection />
        </section>
        <section id="projects">
          <ProjectsSection />
        </section>
      </main>
      <Footer />
    </div>
  )
}