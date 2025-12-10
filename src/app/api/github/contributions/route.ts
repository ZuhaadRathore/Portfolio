import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    )
  }

  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.error('GITHUB_TOKEN environment variable is not set')
    return NextResponse.json(
      { error: 'GitHub token not configured' },
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
          totalContributions
        }
        repositories(first: 100) {
          totalCount
        }
        followers {
          totalCount
        }
        following {
          totalCount
        }
      }
    }
  `

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API error:', response.status, errorText)
      return NextResponse.json(
        { error: `GitHub API request failed: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      return NextResponse.json(
        { error: 'GraphQL query failed', details: data.errors },
        { status: 400 }
      )
    }

    const user = data.data.user
    const weeks = user.contributionsCollection.contributionCalendar.weeks
    const contributionDays = weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: day.contributionLevel === 'NONE' ? 0 :
               day.contributionLevel === 'FIRST_QUARTILE' ? 1 :
               day.contributionLevel === 'SECOND_QUARTILE' ? 2 :
               day.contributionLevel === 'THIRD_QUARTILE' ? 3 : 4
      }))
    )

    return NextResponse.json({
      contributionDays,
      stats: {
        totalContributions: user.contributionsCollection.totalContributions,
        repositoriesCount: user.repositories.totalCount,
        followers: user.followers.totalCount,
        following: user.following.totalCount
      }
    })
  } catch (error) {
    console.error('Failed to fetch contribution data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
