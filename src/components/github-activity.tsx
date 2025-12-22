'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Star, GitCommit, Users } from 'lucide-react'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface GitHubStats {
  totalContributions: number
  repositoriesCount: number
  followers: number
  following: number
}

const GITHUB_USERNAMES = ['ZuhaadRathore', 'Archontas123']

interface FetchResult {
  contributions: ContributionDay[]
  stats: GitHubStats | null
}

const fetchContributionData = async (username: string): Promise<FetchResult> => {
  try {
    const response = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return {
      contributions: data.contributionDays || [],
      stats: data.stats || null
    }
  } catch (error) {
    console.error('Failed to fetch contribution data:', error)
    return { contributions: [], stats: null }
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

const filterAndPadContributionsToYear = (contributions: ContributionDay[]): ContributionDay[] => {
  if (contributions.length === 0) return []

  const currentYear = new Date().getFullYear()
  const jan1 = new Date(`${currentYear}-01-01`)
  const dec31 = new Date(`${currentYear}-12-31`)

  const yearContributions: ContributionDay[] = []

  // Add all days from Jan 1 to Dec 31, filling with contribution data or empty days
  let currentDate = new Date(jan1)
  const contributionMap = new Map(contributions.map(day => [day.date, day]))

  while (currentDate <= dec31) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const dayData = contributionMap.get(dateStr)

    yearContributions.push(dayData || {
      date: dateStr,
      count: 0,
      level: 0
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return yearContributions
}

export default function GitHubActivity() {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true)

        // Fetch contribution data from both accounts in parallel
        const [result1, result2] = await Promise.all([
          fetchContributionData(GITHUB_USERNAMES[0]),
          fetchContributionData(GITHUB_USERNAMES[1])
        ])

        // Merge the contributions
        const mergedContributions = mergeContributions(result1.contributions, result2.contributions)
        const yearContributions = filterAndPadContributionsToYear(mergedContributions)

        setContributions(yearContributions)

        // Merge stats from both accounts
        if (result1.stats && result2.stats) {
          setStats({
            totalContributions: result1.stats.totalContributions + result2.stats.totalContributions,
            repositoriesCount: result1.stats.repositoriesCount + result2.stats.repositoriesCount,
            followers: result1.stats.followers + result2.stats.followers,
            following: result1.stats.following + result2.stats.following
          })
        } else {
          setStats(result1.stats)
        }
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
          Recent Activity
        </h3>
        <p className="text-red-600 dark:text-red-400 text-sm">
          {error || 'No contribution data available'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar with Stats - Now separate from calendar */}
      {stats && (
        <motion.div 
          className="lg:w-64 flex-shrink-0 flex flex-col gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-primary p-4 border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark">
            <h3 className="font-display text-xl uppercase mb-4 text-black flex items-center gap-2">
              GitHub Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-black/10 rounded-full">
                    <GitCommit className="w-5 h-5 text-black" />
                 </div>
                 <div>
                    <div className="text-xs uppercase font-bold text-black/60">Contributions</div>
                    <div className="text-xl font-bold text-black">{stats.totalContributions}</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-black/10 rounded-full">
                    <Star className="w-5 h-5 text-black" />
                 </div>
                 <div>
                    <div className="text-xs uppercase font-bold text-black/60">Repos</div>
                    <div className="text-xl font-bold text-black">{stats.repositoriesCount}</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-black/10 rounded-full">
                    <Users className="w-5 h-5 text-black" />
                 </div>
                 <div>
                    <div className="text-xs uppercase font-bold text-black/60">Followers</div>
                    <div className="text-xl font-bold text-black">{stats.followers}</div>
                 </div>
              </div>
            </div>
          </div>
          
          <motion.a
            href={`https://github.com/${GITHUB_USERNAMES[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-3 font-display uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Visit Profile</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </motion.div>
      )}

      {/* Main Calendar Area */}
      <motion.div
        className="flex-1 bg-background-light dark:bg-background-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark p-4 sm:p-6 overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-primary">
            Contribution Graph
          </h3>
          <div className="text-xs font-mono text-text-light/60 dark:text-text-dark/60">
            {new Date().getFullYear()}
          </div>
        </div>

        <div className="overflow-x-auto pb-2 custom-scrollbar">
            <div className="min-w-max">
                {/* Month labels */}
                <div className="flex gap-0.5 sm:gap-1 mb-2 ml-[30px]">
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
                    if (!firstDay) return <div key={weekIndex} className="w-2.5 sm:w-3.5"></div>

                    const weekDate = new Date(firstDay.date)
                    const isFirstWeekOfMonth = weekDate.getDate() <= 7
                    const monthKey = `${weekDate.getFullYear()}-${weekDate.getMonth()}`
                    const monthName = weekDate.toLocaleString('default', { month: 'short' })

                    const shouldShowMonth = isFirstWeekOfMonth && !displayedMonths.has(monthKey)
                    if (shouldShowMonth) {
                        displayedMonths.add(monthKey)
                    }

                    return (
                        <div key={weekIndex} className="w-2.5 sm:w-3.5 text-[9px] sm:text-xs text-text-light/60 dark:text-text-dark/60 text-center font-mono">
                        {shouldShowMonth ? monthName : ''}
                        </div>
                    )
                    })
                })()}
                </div>

                {/* Day labels and contribution grid */}
                <div className="flex">
                <div className="flex flex-col justify-between gap-1 mr-2 text-[9px] sm:text-xs text-text-light/60 dark:text-text-dark/60 font-mono h-[110px]">
                    <span className="leading-none">Mon</span>
                    <span className="leading-none">Wed</span>
                    <span className="leading-none">Fri</span>
                </div>

                <div className="flex gap-0.5 sm:gap-1">
                    {(() => {
                    const totalDays = contributions.length
                    const weeks = Math.ceil(totalDays / 7)

                    return Array.from({ length: weeks }, (_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-0.5 sm:gap-1">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                            const dataIndex = weekIndex * 7 + dayIndex
                            const day = contributions[dataIndex]

                            const levelColors = [
                            'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                            'bg-primary/30 border border-primary/40',
                            'bg-primary/50 border border-primary/60',
                            'bg-primary/70 border border-primary/80',
                            'bg-primary border border-primary'
                            ]

                            if (!day) return <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />

                            return (
                            <motion.div
                                key={day.date}
                                className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${levelColors[day.level]} rounded-sm`}
                                title={`${day.date}: ${day.count} contributions`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: weekIndex * 0.02, duration: 0.1 }}
                                whileHover={{ scale: 1.4, zIndex: 10, borderColor: '#fff' }}
                            />
                            )
                        })}
                        </div>
                    ))
                    })()}
                </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  )
}
