'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import s from './git-graph.module.css'

type ContributionDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

type ContributionWeek = {
  contributionDays: ContributionDay[]
}

type ApiResponse =
  | {
      weeks: ContributionWeek[]
      username: string
      stats: {
        totalContributions: number
        repositories: number
      }
    }
  | { error: string }

const USERNAMES = ['ZuhaadRathore', 'Archontas123']

const LEVEL_COLORS: Record<ContributionDay['level'], string> = {
  0: 'rgba(0, 0, 0, 0.05)',
  1: '#ffcccc',
  2: '#ff9999',
  3: '#ff4d4d',
  4: 'var(--red)',
}

let cachedWeeks: ContributionWeek[] | null = null
let cachedStats: {
  totalContributions: number
  repositories: number
} | null = null
let cachedError: string | null = null

function formatMonthLabel(dateISO: string) {
  const d = new Date(dateISO)
  return d.toLocaleString('en-US', { month: 'short' })
}

// ── Count-up hook ──
function useCountUp(target: number, trigger: boolean, duration = 1200) {
  const [value, setValue] = useState(0)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!trigger || target === 0) {
      if (trigger) setValue(target)
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [trigger, target, duration])

  return value
}

// ── Tooltip state ──
type TooltipData = {
  date: string
  count: number
  x: number
  y: number
} | null

export default function GitGraph({
  skipIntro = false,
  isActive = false,
}: {
  skipIntro?: boolean
  isActive?: boolean
}) {
  const [weeks, setWeeks] = useState<ContributionWeek[]>(() => cachedWeeks ?? [])
  const [stats, setStats] = useState<{
    totalContributions: number
    repositories: number
  } | null>(() => cachedStats)
  const [loading, setLoading] = useState(() => !cachedWeeks && !cachedError)
  const [error, setError] = useState<string | null>(() => cachedError)

  // Animation states
  const [sectionVisible, setSectionVisible] = useState(skipIntro)
  const [cellsRevealed, setCellsRevealed] = useState(skipIntro)
  const [shimmerDone, setShimmerDone] = useState(skipIntro)
  const sectionRef = useRef<HTMLElement>(null)

  // Hover states
  const [hoveredCell, setHoveredCell] = useState<{
    weekIndex: number
    dayIndex: number
  } | null>(null)
  const [tooltip, setTooltip] = useState<TooltipData>(null)

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [dropdownOpen])

  // Count-up triggers
  const shouldAnimateStats = sectionVisible && !loading && !skipIntro
  const contribCount = useCountUp(
    stats?.totalContributions ?? 0,
    shouldAnimateStats,
    1400
  )
  const repoCount = useCountUp(
    stats?.repositories ?? 0,
    shouldAnimateStats,
    1000
  )

  // Fetch data from all accounts and merge
  useEffect(() => {
    if (cachedWeeks || cachedError) return

    let cancelled = false
    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const results = await Promise.all(
          USERNAMES.map(async (username) => {
            const res = await fetch(
              `/api/github/contributions?username=${encodeURIComponent(username)}`,
              { cache: 'no-store' }
            )
            const json = (await res.json()) as ApiResponse
            if (!res.ok || 'error' in json) {
              return null
            }
            return json
          })
        )

        if (cancelled) return

        // Filter successful responses
        const valid = results.filter(
          (r): r is Exclude<ApiResponse, { error: string }> => r !== null && !('error' in r)
        )

        if (valid.length === 0) {
          throw new Error('Failed to load data from any GitHub account')
        }

        // Use the first account's week structure as the base, merge counts
        const baseWeeks = valid[0].weeks
        const merged: ContributionWeek[] = baseWeeks.map((week, wi) => ({
          contributionDays: week.contributionDays.map((day, di) => {
            let totalCount = day.count
            // Add contributions from other accounts for the same date
            for (let a = 1; a < valid.length; a++) {
              const otherDay = valid[a].weeks?.[wi]?.contributionDays?.[di]
              if (otherDay && otherDay.date === day.date) {
                totalCount += otherDay.count
              }
            }
            // Recalculate level based on merged count
            const level: ContributionDay['level'] =
              totalCount === 0 ? 0 :
              totalCount <= 3 ? 1 :
              totalCount <= 6 ? 2 :
              totalCount <= 10 ? 3 : 4
            return { date: day.date, count: totalCount, level }
          }),
        }))

        // Merge stats
        const totalContributions = valid.reduce(
          (sum, r) => sum + (r.stats?.totalContributions ?? 0), 0
        )
        const totalRepos = valid.reduce(
          (sum, r) => sum + (r.stats?.repositories ?? 0), 0
        )

        cachedWeeks = merged
        cachedStats = { totalContributions, repositories: totalRepos }
        cachedError = null
        setWeeks(merged)
        setStats({ totalContributions, repositories: totalRepos })
      } catch (e) {
        const nextError = e instanceof Error ? e.message : 'Failed to load GitHub data'
        cachedError = nextError
        if (!cancelled) {
          setWeeks([])
          setStats(null)
          setError(nextError)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  // Section visibility observer
  useEffect(() => {
    if (skipIntro) return
    if (!sectionRef.current) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSectionVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px 40px 0px' }
    )
    obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [skipIntro])


  // Wave fill: once visible + data loaded, trigger cell reveals with staggered delays
  const [visibleCells, setVisibleCells] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!sectionVisible || loading || weeks.length === 0) return

    if (skipIntro) {
      const allCells = new Set<string>()
      weeks.forEach((week, wi) => {
        week.contributionDays.forEach((_, di) => {
          allCells.add(`${wi}-${di}`)
        })
      })
      setVisibleCells(allCells)
      setCellsRevealed(true)
      setShimmerDone(true)
      return
    }

    // Small delay for shimmer to start first
    const timers: ReturnType<typeof setTimeout>[] = []
    const totalWeeks = weeks.length

    // Diagonal wave: delay based on (weekIndex + dayIndex) so it sweeps
    // from top-left to bottom-right
    const maxDiag = totalWeeks + 6 // max possible wi + di
    const diagDuration = 2200 // total wave duration in ms
    const msPerStep = diagDuration / maxDiag

    // Batch by diagonal index to reduce setState calls
    const diagBuckets = new Map<number, string[]>()
    weeks.forEach((week, wi) => {
      week.contributionDays.forEach((_, di) => {
        const diag = wi + di
        if (!diagBuckets.has(diag)) diagBuckets.set(diag, [])
        diagBuckets.get(diag)!.push(`${wi}-${di}`)
      })
    })

    diagBuckets.forEach((keys, diag) => {
      const delay = diag * msPerStep
      const t = setTimeout(() => {
        setVisibleCells((prev) => {
          const next = new Set(prev)
          keys.forEach((k) => next.add(k))
          return next
        })
      }, delay)
      timers.push(t)
    })

    const waveEnd = maxDiag * msPerStep

    // Mark done (no shimmer)
    const doneTimer = setTimeout(() => {
      setCellsRevealed(true)
      setShimmerDone(true)
    }, waveEnd + 200)
    timers.push(doneTimer)

    return () => timers.forEach(clearTimeout)
  }, [sectionVisible, loading, skipIntro, weeks])

  // Month labels
  const monthLabels = useMemo(() => {
    const labels: Array<string | null> = []
    let lastMonthKey: string | null = null

    for (const week of weeks) {
      const firstDay = week.contributionDays[0]
      if (!firstDay) {
        labels.push(null)
        continue
      }

      const d = new Date(firstDay.date)
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`
      const isFirstWeekOfMonth = d.getDate() <= 7

      if (isFirstWeekOfMonth && monthKey !== lastMonthKey) {
        labels.push(formatMonthLabel(firstDay.date))
        lastMonthKey = monthKey
      } else {
        labels.push(null)
      }
    }

    return labels
  }, [weeks])

  // Cell hover handlers
  const onCellEnter = (
    weekIndex: number,
    dayIndex: number,
    day: ContributionDay,
    e: React.MouseEvent
  ) => {
    setHoveredCell({ weekIndex, dayIndex })
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltip({
      date: day.date,
      count: day.count,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    })
  }

  const onCellLeave = () => {
    setHoveredCell(null)
    setTooltip(null)
  }

  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  return (
    <section
      ref={sectionRef}
      id="git-graph"
      className={`${s.section} ${isActive ? s.sectionInView : ''}`}
      aria-label="GitHub contributions graph"
    >
      <div className={`${s.header} ${sectionVisible ? s.headerVisible : ''}`}>
        <span className={s.headerIndex} aria-hidden="true">04</span>
        <span className={s.title}>GIT GRAPH</span>
        <div className={s.linkGroup} ref={dropdownRef}>
          <a
            className={s.link}
            href={`https://github.com/${USERNAMES[0]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/{USERNAMES[0]}
          </a>
          <button
            className={s.dropdownToggle}
            onClick={() => setDropdownOpen((v) => !v)}
            aria-expanded={dropdownOpen}
            aria-label="Show other profiles"
          >
            <svg
              className={`${s.dropdownArrow} ${dropdownOpen ? s.dropdownArrowOpen : ''}`}
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
            >
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={`${s.dropdownMenu} ${dropdownOpen ? s.dropdownMenuOpen : ''}`}>
            {USERNAMES.slice(1).map((username) => (
              <a
                key={username}
                className={s.dropdownItem}
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDropdownOpen(false)}
              >
                github.com/{username}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={s.frame}>
        {loading ? (
          <div className={s.skeleton} aria-label="Loading GitHub graph" />
        ) : error || weeks.length === 0 ? (
          <div className={s.error} role="status">
            <div className={s.errorTitle}>Unable to load GitHub graph</div>
            <div className={s.errorBody}>
              {error || 'No contribution data available.'}
            </div>
          </div>
        ) : (
          <div className={s.content}>
            <div className={s.gridWrap}>
              <div className={s.monthRow} aria-hidden="true">
                <div className={s.monthSpacer} />
                <div className={s.monthWeeks}>
                  {monthLabels.map((label, i) => (
                    <div
                      key={i}
                      className={`${s.monthCell} ${
                        hoveredCell?.weekIndex === i ? s.monthCellHighlight : ''
                      }`}
                    >
                      {label || ''}
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.grid}>
                <div className={s.dayLabels} aria-hidden="true">
                  {DAY_LABELS.map((label, i) => (
                    <div
                      key={i}
                      className={`${s.dayLabel} ${
                        hoveredCell?.dayIndex === i ? s.dayLabelHighlight : ''
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                <div
                  className={s.weeks}
                  role="grid"
                  aria-label="Contribution calendar"
                  onMouseLeave={onCellLeave}
                >
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className={s.week} role="row">
                      {week.contributionDays.map((day, dayIndex) => {
                        const key = `${weekIndex}-${dayIndex}`
                        const isVisible = visibleCells.has(key)
                        const isHovered =
                          hoveredCell?.weekIndex === weekIndex &&
                          hoveredCell?.dayIndex === dayIndex
                        const isDimmed =
                          hoveredCell !== null && !isHovered &&
                          hoveredCell.weekIndex !== weekIndex &&
                          hoveredCell.dayIndex !== dayIndex

                        return (
                          <div
                            key={day.date}
                            className={[
                              s.cell,
                              isVisible ? s.cellVisible : '',
                              isHovered ? s.cellHovered : '',
                              isDimmed ? s.cellDimmed : '',
                            ].join(' ')}
                            role="gridcell"
                            style={{
                              backgroundColor: LEVEL_COLORS[day.level],
                              transitionDelay: isVisible && !shimmerDone
                                ? '0ms'
                                : undefined,
                            }}
                            onMouseEnter={(e) =>
                              onCellEnter(weekIndex, dayIndex, day, e)
                            }
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.legend} aria-hidden="true">
                <span>Less</span>
                <div className={s.legendSwatches}>
                  {([0, 1, 2, 3, 4] as const).map((k) => (
                    <span
                      key={k}
                      className={s.legendSwatch}
                      style={{ backgroundColor: LEVEL_COLORS[k] }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>

            <aside className={s.stats} aria-label="GitHub stats">
              <div className={s.statsTitle}>STATS</div>
              <div className={s.statsGrid}>
                <div className={s.stat}>
                  <div className={s.statLabel}>Contribs</div>
                  <div className={s.statValue}>
                    {stats
                      ? (skipIntro
                        ? stats.totalContributions.toLocaleString()
                        : contribCount.toLocaleString())
                      : '—'}
                  </div>
                </div>
                <div className={s.stat}>
                  <div className={s.statLabel}>Repos</div>
                  <div className={s.statValue}>
                    {stats
                      ? (skipIntro
                        ? stats.repositories.toLocaleString()
                        : repoCount.toLocaleString())
                      : '—'}
                  </div>
                </div>
              </div>
              <div className={s.statsNote}>Last 12 months</div>
            </aside>
          </div>
        )}
      </div>

      {/* Floating tooltip */}
      {tooltip && typeof document !== 'undefined' && createPortal(
        <div
          className={`${s.tooltip} ${s.tooltipVisible}`}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {formatDate(tooltip.date)} ·{' '}
          <span className={s.tooltipCount}>
            {tooltip.count} {tooltip.count === 1 ? 'contribution' : 'contributions'}
          </span>
        </div>,
        document.body
      )}
    </section>
  )
}
