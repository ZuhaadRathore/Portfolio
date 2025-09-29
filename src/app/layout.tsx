import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Zuhaad's Portfolio",
  description: 'Digital Craftsman & Code Artisan - Building exceptional and accessible digital experiences for the web.',
  keywords: ['portfolio', 'web developer', 'full stack', 'react', 'next.js', 'typescript'],
  authors: [{ name: 'Zuhaad' }],
  openGraph: {
    title: "Zuhaad's Portfolio",
    description: 'Digital Craftsman & Code Artisan',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} selection:bg-primary selection:text-black`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}