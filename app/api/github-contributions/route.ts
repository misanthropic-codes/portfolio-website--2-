import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const GITHUB_USERNAME = "misanthropic-codes"
  const GITHUB_GRAPHQL_API = "https://api.github.com/graphql"
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: "GitHub token not found." }, { status: 500 })
  }
  const today = new Date()
  const lastYear = new Date(today)
  lastYear.setFullYear(today.getFullYear() - 1)
  const from = lastYear.toISOString() // Use full ISO string
  const to = today.toISOString() // Use full ISO string
  const query = `
    query {
      user(login: \"${GITHUB_USERNAME}\") {
        contributionsCollection(from: \"${from}\", to: \"${to}\") {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
            totalContributions
          }
        }
      }
    }
  `
  const res = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  })
  const json = await res.json()
  console.log("GitHub GraphQL response:", JSON.stringify(json, null, 2)) // Debug log
  const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks || []
  const totalContributions = json.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0
  return NextResponse.json({ weeks, totalContributions })
}
