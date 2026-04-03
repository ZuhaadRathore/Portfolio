import { NextRequest, NextResponse } from 'next/server'

type ApiDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

type ApiWeek = {
  contributionDays: ApiDay[]
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'GitHub token not configured (missing GITHUB_TOKEN)' },
      { status: 500 }
    )
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
        repositories(first: 1) {
          totalCount
        }
      }
    }
  `

  try {
    const ghRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      cache: 'no-store',
    })

    if (!ghRes.ok) {
      const errorText = await ghRes.text()
      return NextResponse.json(
        { error: `GitHub API request failed: ${ghRes.status}`, details: errorText },
        { status: 502 }
      )
    }

    const data = await ghRes.json()

    if (data.errors) {
      return NextResponse.json(
        { error: 'GraphQL query failed', details: data.errors },
        { status: 502 }
      )
    }

    const weeksRaw = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks
    const user = data?.data?.user
    const weeks: ApiWeek[] = (weeksRaw || []).map((week: any) => ({
      contributionDays: (week.contributionDays || []).map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level:
          day.contributionLevel === 'NONE'
            ? 0
            : day.contributionLevel === 'FIRST_QUARTILE'
              ? 1
              : day.contributionLevel === 'SECOND_QUARTILE'
                ? 2
                : day.contributionLevel === 'THIRD_QUARTILE'
                  ? 3
                  : 4,
      })),
    }))

    const totalContributions = weeks.reduce((sum, week) => {
      return sum + week.contributionDays.reduce((innerSum, day) => innerSum + day.count, 0)
    }, 0)

    return NextResponse.json({
      username,
      weeks,
      stats: {
        totalContributions,
        repositories: user?.repositories?.totalCount ?? 0,
      },
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
