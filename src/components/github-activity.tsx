'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface ContributionDay {
  date: string
  count: number
  level: number
}

const GITHUB_USERNAMES = ['ZuhaadRathore', 'Archontas123']

const fetchContributionData = async (username: string): Promise<ContributionDay[]> => {
  try {
    const response = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.contributionDays || []
  } catch (error) {
    console.error('Failed to fetch contribution data:', error)
    return []
  }
}

const mergeContributions = (contributions1: ContributionDay[], contributions2: ContributionDay[]): ContributionDay[] => {
  const contributionMap = new Map<string, ContributionDay>()

  // Add contributions from first account
  contributions1.forEach(day => {
    contributionMap.set(day.date, { ...day })
  })

  // Merge contributions from second account
  contributions2.forEach(day => {
    const existing = contributionMap.get(day.date)
    if (existing) {
      const newCount = existing.count + day.count
      // Recalculate level based on combined count
      let newLevel = 0
      if (newCount > 0) newLevel = 1
      if (newCount >= 3) newLevel = 2
      if (newCount >= 6) newLevel = 3
      if (newCount >= 9) newLevel = 4

      contributionMap.set(day.date, {
        date: day.date,
        count: newCount,
        level: newLevel
      })
    } else {
      contributionMap.set(day.date, { ...day })
    }
  })

  // Convert back to array and sort by date
  return Array.from(contributionMap.values()).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

export default function GitHubActivity() {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true)

        // Fetch contribution data from both accounts in parallel
        const [contributions1, contributions2] = await Promise.all([
          fetchContributionData(GITHUB_USERNAMES[0]),
          fetchContributionData(GITHUB_USERNAMES[1])
        ])

        // Merge the contributions
        const mergedContributions = mergeContributions(contributions1, contributions2)
        setContributions(mergedContributions)
      } catch (err) {
        setError('Failed to load GitHub data.')
        console.error('GitHub API Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || contributions.length === 0) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-3 border-red-500 p-6">
        <h3 className="font-display text-lg uppercase tracking-tight mb-2 text-red-600 dark:text-red-400">
          GitHub Contributions
        </h3>
        <p className="text-red-600 dark:text-red-400 text-sm">
          {error || 'No contribution data available'}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-background-light dark:bg-background-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark p-4 sm:p-6"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-primary">
          GitHub Contributions
        </h3>
        <motion.a
          href={`https://github.com/${GITHUB_USERNAMES[0]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-xs sm:text-sm font-semibold flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View Profile</span>
          <ExternalLink className="w-3 h-3" />
        </motion.a>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-3 sm:p-4 overflow-x-auto">
        {/* Month labels */}
        <div className="flex gap-0.5 sm:gap-1 mb-1 sm:mb-2 min-w-max ml-[42px] sm:ml-[58px]">
          {(() => {
            const weeks: ContributionDay[][] = []
            let currentWeek: ContributionDay[] = []
            let displayedMonths = new Set<string>()

            contributions.forEach((day, index) => {
              const dayOfWeek = new Date(day.date).getDay()

              if (dayOfWeek === 0 && currentWeek.length > 0) {
                weeks.push([...currentWeek])
                currentWeek = []
              }

              currentWeek.push(day)

              if (index === contributions.length - 1) {
                weeks.push(currentWeek)
              }
            })

            return weeks.map((week, weekIndex) => {
              const firstDay = week[0]
              if (!firstDay) return <div key={weekIndex} className="w-1.5 sm:w-2.5"></div>

              const weekDate = new Date(firstDay.date)
              const isFirstWeekOfMonth = weekDate.getDate() <= 7
              const monthKey = `${weekDate.getFullYear()}-${weekDate.getMonth()}`
              const monthName = weekDate.toLocaleString('default', { month: 'short' })

              // Only show month label if it's the first week AND we haven't displayed this month yet
              const shouldShowMonth = isFirstWeekOfMonth && !displayedMonths.has(monthKey)
              if (shouldShowMonth) {
                displayedMonths.add(monthKey)
              }

              return (
                <div key={weekIndex} className="w-1.5 sm:w-2.5 text-[8px] sm:text-xs text-text-light/60 dark:text-text-dark/60 text-center">
                  {shouldShowMonth ? monthName : ''}
                </div>
              )
            })
          })()}
        </div>

        {/* Day labels and contribution grid */}
        <div className="flex mb-1 sm:mb-2">
          <div className="flex flex-col gap-0.5 sm:gap-1 mr-1 sm:mr-2 text-[8px] sm:text-xs text-text-light/60 dark:text-text-dark/60">
            <div className="h-1.5 sm:h-2.5"></div>
            <div className="h-1.5 sm:h-2.5 flex items-center">Mon</div>
            <div className="h-1.5 sm:h-2.5"></div>
            <div className="h-1.5 sm:h-2.5 flex items-center">Wed</div>
            <div className="h-1.5 sm:h-2.5"></div>
            <div className="h-1.5 sm:h-2.5 flex items-center">Fri</div>
            <div className="h-1.5 sm:h-2.5"></div>
          </div>

          <div className="flex gap-0.5 sm:gap-1 min-w-max">
            {(() => {
              const totalDays = contributions.length
              const weeks = Math.ceil(totalDays / 7)

              return Array.from({ length: weeks }, (_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5 sm:gap-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex
                    const day = contributions[dataIndex]

                    const levelColors = [
                      'bg-gray-200 dark:bg-gray-700',
                      'bg-green-200 dark:bg-green-800',
                      'bg-green-300 dark:bg-green-700',
                      'bg-green-400 dark:bg-green-600',
                      'bg-green-500 dark:bg-green-500'
                    ]

                    if (!day) {
                      return (
                        <div
                          key={`empty-${weekIndex}-${dayIndex}`}
                          className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5"
                        />
                      )
                    }

                    return (
                      <motion.div
                        key={day.date}
                        className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 ${levelColors[day.level]} transition-colors duration-200`}
                        title={`${day.date}: ${day.count} contributions`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: weekIndex * 0.05, duration: 0.1 }}
                        whileHover={{ scale: 1.5 }}
                      />
                    )
                  })}
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}