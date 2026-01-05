'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Github, Linkedin, Twitter, ChevronDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import Magnetic from '@/components/ui/magnetic'
import { useRef } from 'react'

export default function HeroSection() {
  const containerRef = useRef(null)
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const socialLinks = [
    { icon: Github, href: "https://github.com/ZuhaadRathore", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/zuhaad-rathore", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/zuhaad_rathore", label: "Twitter" }
  ]

  const titleWords = ["Engineer &", "Designer"]

  return (
    <section
      ref={containerRef}
      id="home"
      className="flex flex-col justify-center items-center relative py-12 md:py-24 pb-32 min-h-[90vh]"
    >
      <div 
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-center w-full max-w-7xl mx-auto px-4 sm:px-6"
      >
        <div className="md:col-span-2 z-10">
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter mb-6 text-text-light dark:text-text-dark leading-[0.85]">
            {titleWords.map((word, i) => (
              <div key={i} className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={isVisible ? { y: 0 } : { y: "100%" }}
                  transition={{ 
                    duration: 1, 
                    ease: [0.33, 1, 0.68, 1],
                    delay: 0.1 + (i * 0.1) 
                  }}
                >
                  {word}
                </motion.div>
              </div>
            ))}
          </h1>
          
          <div className="overflow-hidden mb-8">
             <motion.p
              className="text-lg sm:text-xl md:text-2xl text-text-light/80 dark:text-text-dark/80 max-w-2xl font-body"
              initial={{ y: "100%", opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Building beautiful, functional web applications from concept to deployment.
            </motion.p>
          </div>

          <motion.div
            className="flex gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {socialLinks.map((social, i) => (
              <Magnetic key={social.label}>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="block text-text-light dark:text-text-dark hover:text-primary transition-colors"
                >
                  <div className="p-3 border-2 border-transparent hover:border-text-light dark:hover:border-text-dark rounded-full transition-all duration-300">
                    <social.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </Link>
              </Magnetic>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ y, opacity }}
          className="relative w-full max-w-[300px] sm:max-w-md mx-auto md:mx-0 md:justify-self-end"
        >
          {/* Background blob */}
          <motion.div
            className="absolute top-4 left-4 w-full h-full bg-primary rounded-full"
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          />

          {/* Person Outline SVG - behind the photo */}
          <motion.div
            className="absolute inset-0 z-[3] flex items-center justify-center text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 0.15, scale: 1.1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          >
            <svg
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Head outline */}
              <ellipse cx="200" cy="140" rx="85" ry="100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              {/* Neck */}
              <path d="M 160 210 Q 160 230, 160 240 L 240 240 Q 240 230, 240 210" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              {/* Shoulders and upper body */}
              <path d="M 160 240 Q 140 250, 120 270 L 100 340 Q 100 360, 120 370 L 180 370 L 180 300 Q 180 260, 200 260 Q 220 260, 220 300 L 220 370 L 280 370 Q 300 360, 300 340 L 280 270 Q 260 250, 240 240" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Hair/head details */}
              <path d="M 115 140 Q 110 110, 130 90 Q 160 70, 200 70 Q 240 70, 270 90 Q 290 110, 285 140" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Facial features */}
              <circle cx="175" cy="135" r="3" fill="currentColor"/>
              <circle cx="225" cy="135" r="3" fill="currentColor"/>
              <path d="M 190 165 Q 200 168, 210 165" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* Clothing detail */}
              <line x1="200" y1="260" x2="200" y2="370" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* Collar */}
              <path d="M 160 240 L 180 260 L 200 250 L 220 260 L 240 240" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          {/* Rotating dashed circle outline */}
          <motion.div
            className="absolute -inset-3 z-[5]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <motion.circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="3 6"
                className="text-primary opacity-40"
                initial={{ pathLength: 0, rotate: 0 }}
                animate={isVisible ? {
                  pathLength: 1,
                  rotate: 360
                } : {
                  pathLength: 0,
                  rotate: 0
                }}
                transition={{
                  pathLength: { duration: 2, delay: 0.8, ease: "easeInOut" },
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              />
            </svg>
          </motion.div>

          {/* Profile picture */}
          <motion.div
            className="relative z-10 w-full aspect-square rounded-full border-4 border-border-light dark:border-border-dark overflow-hidden bg-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Image
              src="/images/pfp-removebg-preview.png"
              alt="Zuhaad Rathore - Software Engineer & Designer"
              fill
              sizes="(max-width: 768px) 300px, 448px"
              quality={95}
              className="object-contain scale-110 hover:scale-100 transition-transform duration-700 ease-out"
              priority
            />
          </motion.div>
          
          <motion.div
            className="absolute bottom-0 -right-4 z-20"
            initial={{ scale: 0, rotate: -20 }}
            animate={isVisible ? { scale: 1, rotate: -5 } : { scale: 0, rotate: -20 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 1 
            }}
          >
            <Magnetic>
              <div className="group bg-surface-light dark:bg-surface-dark px-6 py-3 border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark cursor-default hover:bg-primary transition-colors duration-300">
                <p className="font-body text-sm font-bold uppercase text-primary group-hover:text-white tracking-widest flex items-center gap-2">
                  Available for Hire
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </p>
              </div>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => {
            const nextSection = document.getElementById('about') || document.body.nextElementSibling
            if (nextSection) {
               nextSection.scrollIntoView({ behavior: 'smooth' })
            } else {
               window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
            }
        }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-text-light dark:text-text-dark z-20 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll</span>
        {/* Simple CSS animation instead of Framer Motion for better robustness */}
        <div className="animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </motion.button>
    </section>
  )
}
