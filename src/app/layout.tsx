import type { Metadata } from 'next'
import { Inter, Space_Mono, IM_Fell_English } from 'next/font/google'
import PageTransitionProvider from '@/components/page-transition'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

const imFell = IM_Fell_English({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-im-fell',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceMono.variable} ${imFell.variable} relative`}>
        {/* SVG filter definitions — pencil edge roughening */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <filter id="pencil-roughen" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={4} seed={2} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.8} xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="pencil-roughen-icon" x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves={3} seed={7} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="pencil-roughen-soft" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={11} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.1} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  )
}
