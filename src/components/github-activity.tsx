'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitCommit, Star, GitFork, Calendar, ExternalLink } from 'lucide-react'

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
}

interface GitHubEvent {
  id: string
  type: string
  repo: {
    name: string
    url: string
  }
  created_at: string
  payload: any
}

interface GitHubUser {
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

interface ContributionDay {
  date: string
  count: number
  level: number
}

const GITHUB_USERNAME = 'ZuhaadRathore'

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

export default function GitHubActivity() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true)

        // Fetch user data, repos, and recent events in parallel
        const [userResponse, reposResponse, eventsResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`)
        ])

        if (!userResponse.ok || !reposResponse.ok || !eventsResponse.ok) {
          throw new Error('Failed to fetch GitHub data')
        }

        const [userData, reposData, eventsData] = await Promise.all([
          userResponse.json(),
          reposResponse.json(),
          eventsResponse.json()
        ])

        setUser(userData)
        setRepos(reposData)
        setEvents(eventsData.slice(0, 5)) // Get latest 5 events for display

        // Fetch real contribution graph data using GraphQL
        const contributionData = await fetchContributionData(GITHUB_USERNAME)
        setContributions(contributionData)
      } catch (err) {
        setError('Failed to load GitHub data. Please check the username.')
        console.error('GitHub API Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getEventDescription = (event: GitHubEvent) => {
    switch (event.type) {
      case 'PushEvent':
        const commits = event.payload.commits?.length || 0
        return `Pushed ${commits} commit${commits !== 1 ? 's' : ''}`
      case 'CreateEvent':
        return `Created ${event.payload.ref_type}`
      case 'ForkEvent':
        return 'Forked repository'
      case 'WatchEvent':
        return 'Starred repository'
      case 'PullRequestEvent':
        return `${event.payload.action} pull request`
      case 'IssuesEvent':
        return `${event.payload.action} issue`
      default:
        return event.type.replace('Event', '')
    }
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-3 border-red-500 p-8">
        <h3 className="font-display text-xl uppercase tracking-tight mb-2 text-red-600 dark:text-red-400">
          GitHub Activity
        </h3>
        <p className="text-red-600 dark:text-red-400">
          {error}
        </p>
        <p className="text-sm text-red-500 dark:text-red-300 mt-2">
          Update the GITHUB_USERNAME in the component to see your activity.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="bg-background-light dark:bg-background-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark p-4 sm:p-6 md:p-8"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <h3 className="font-display text-lg sm:text-xl md:text-2xl uppercase tracking-tight text-primary">
            GitHub Activity
          </h3>
          <motion.a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-2 text-primary hover:text-primary/80 transition-colors flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xs sm:text-sm font-semibold">View Profile</span>
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.a>
        </div>


        <div className="space-y-4 sm:space-y-6">
          <div>
            <h4 className="font-display text-base sm:text-lg uppercase tracking-tight mb-3 sm:mb-4 text-text-light dark:text-text-dark">
              Contribution Activity
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-2 sm:p-4 overflow-x-auto">
              {/* Month labels */}
              <div className="flex gap-0.5 sm:gap-1 mb-1 sm:mb-2 min-w-max ml-[42px] sm:ml-[58px]">
                {(() => {
                  const weeks: ContributionDay[][] = []
                  let currentWeek: ContributionDay[] = []

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
                    const monthName = weekDate.toLocaleString('default', { month: 'short' })

                    return (
                      <div key={weekIndex} className="w-1.5 sm:w-2.5 text-[8px] sm:text-xs text-text-light/60 dark:text-text-dark/60 text-center">
                        {isFirstWeekOfMonth ? monthName : ''}
                      </div>
                    )
                  })
                })()}
              </div>

              {/* Day labels */}
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
                  {/* Group contributions by weeks as GitHub does */}
                  {(() => {
                    // GitHub returns data already organized by weeks
                    // Let's use a simpler approach that matches GitHub's exact structure
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
                            // Empty slot for days that don't exist
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
          </div>

          <div>
            <h4 className="font-display text-base sm:text-lg uppercase tracking-tight mb-3 sm:mb-4 text-text-light dark:text-text-dark">
              Recent Repositories
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {repos.map((repo) => (
                <motion.a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:border-primary transition-colors"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h5 className="font-semibold text-primary truncate text-sm sm:text-base">{repo.name}</h5>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-text-light/60 dark:text-text-dark/60 flex-shrink-0">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Star className="w-3 h-3" />
                        <span className="hidden xs:inline">{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <GitFork className="w-3 h-3" />
                        <span className="hidden xs:inline">{repo.forks_count}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-text-light/70 dark:text-text-dark/70 mb-2 line-clamp-2">
                    {repo.description || 'No description available'}
                  </p>
                  <div className="flex justify-between items-center text-xs gap-2">
                    <span className="text-primary truncate">{repo.language}</span>
                    <span className="text-text-light/60 dark:text-text-dark/60 flex-shrink-0 text-[10px] sm:text-xs">
                      {formatDate(repo.updated_at)}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-base sm:text-lg uppercase tracking-tight mb-3 sm:mb-4 text-text-light dark:text-text-dark">
              Recent Activity
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GitCommit className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm font-medium text-text-light dark:text-text-dark">
                        {getEventDescription(event)}
                      </span>
                      <span className="text-xs text-primary truncate">
                        {event.repo.name.split('/')[1]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-text-light/60 dark:text-text-dark/60 flex-shrink-0">
                    <Calendar className="w-3 h-3 hidden sm:block" />
                    <span className="hidden sm:inline">{formatDate(event.created_at)}</span>
                    <span className="sm:hidden">{new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}