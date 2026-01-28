'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Github, Linkedin, Twitter, ChevronDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import Magnetic from '@/components/ui/magnetic'
import { useRef, useState } from 'react'

export default function HeroSection() {
  const containerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
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
                    duration: 0.8, 
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
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              Building beautiful, functional web applications from concept to deployment.
            </motion.p>
          </div>

          <motion.div
            className="flex gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
          className="relative w-full max-w-[350px] sm:max-w-xl mx-auto md:mx-0 md:justify-self-end"
        >
          {/* Artistic hand-drawn white outline */}
          <motion.div
            className="relative z-10 w-full aspect-square overflow-visible cursor-pointer"
            initial={{ opacity: 0, scale: 0.95, rotate: -5 }}
            animate={isVisible ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.95, rotate: -5 }}
            transition={{
              duration: 1.0,
              delay: 0.4,
              ease: [0.34, 1.56, 0.64, 1],
              rotate: { duration: 1.2, ease: "easeOut" }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Wrapper for both layers to rotate/wobble together */}
            <motion.div
              className="absolute inset-0"
              animate={{
                rotate: isHovered ? 0 : [0, 1, -1, 0],
                scale: isHovered ? 1.05 : 1
              }}
              transition={{
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 }
              }}
            >
              {/* Layer 1: Color Image (Behind) - Fades in on hover */}
              <motion.div 
                className="absolute inset-0 z-0"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Image
                  src="/images/pfp-removebg-preview.png"
                  alt="Zuhaad Rathore - Software Engineer & Designer"
                  fill
                  sizes="(max-width: 768px) 300px, 448px"
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Layer 2: Outline Sketch (Front) - Always visible, acts as the "lines" to be filled */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <Image
                  src="/images/pfp-removebg-preview.png"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 300px, 448px"
                  className="object-contain"
                  style={{
                    filter: 'url(#artistic-sketch-filter)',
                    opacity: 0.9,
                  }}
                  priority
                />
              </div>
            </motion.div>

            {/* Enhanced SVG filter for artistic hand-drawn effect */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <filter id="artistic-sketch-filter" x="-50%" y="-50%" width="200%" height="200%">
                  {/* Generate base outline from alpha */}
                  <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="dilated" />
                  <feMorphology operator="erode" radius="1" in="SourceAlpha" result="eroded" />
                  <feComposite in="dilated" in2="eroded" operator="out" result="outline" />

                  {/* Stroke 1: Large wobble (The heavy hand) */}
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" result="noise1" seed="1" />
                  <feDisplacementMap in="outline" in2="noise1" scale="6" result="stroke1" />

                  {/* Stroke 2: Fine detail (The detail sketch) */}
                  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise2" seed="2" />
                  <feDisplacementMap in="outline" in2="noise2" scale="4" result="stroke2" />

                  {/* Stroke 3: Scribble (The artistic chaos) */}
                  <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" result="noise3" seed="3" />
                  <feDisplacementMap in="outline" in2="noise3" scale="2" result="stroke3" />

                  {/* Merge strokes to create "sketchy" look */}
                  <feMerge result="sketch">
                    <feMergeNode in="stroke1" />
                    <feMergeNode in="stroke2" />
                    <feMergeNode in="stroke3" />
                  </feMerge>

                  {/* Slight blur for pencil texture */}
                  <feGaussianBlur stdDeviation="0.5" in="sketch" result="softSketch" />

                  {/* Colorize White */}
                  <feFlood floodColor="white" result="white" />
                  <feComposite in="white" in2="softSketch" operator="in" result="whiteSketch" />

                  {/* Add Glow */}
                  <feGaussianBlur in="whiteSketch" stdDeviation="2" result="glow" />
                  
                  {/* Final Composition */}
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="whiteSketch" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
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
