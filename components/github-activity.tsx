"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, GitCommit, Calendar, Star, TrendingUp, Activity } from "lucide-react"

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

interface GitHubStats {
  public_repos: number
  followers: number
  following: number
  created_at: string
}

interface ContributionDay {
  date: string
  count: number
  level: number
  color?: string // Add color property for GitHub-like graph
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

const GITHUB_USERNAME = "misanthropic-codes"
const GITHUB_GRAPHQL_API = "https://api.github.com/graphql"
const token = process.env.GITHUB_TOKEN

export function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [totalPushes, setTotalPushes] = useState<number>(0)
  const [totalPRs, setTotalPRs] = useState<number>(0)
  const [contributions, setContributions] = useState<ContributionWeek[]>([])
  const [totalContributions, setTotalContributions] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user stats
        const userResponse = await fetch("https://api.github.com/users/misanthropic-codes")
        const userData = await userResponse.json()
        setStats(userData)

        // Fetch recent activity (more events to count pushes and PRs)
        const eventsResponse = await fetch("https://api.github.com/users/misanthropic-codes/events/public?per_page=100")
        const eventsData = await eventsResponse.json()
        setEvents(eventsData)

        // Count total push events and pull requests
        const pushEvents = eventsData.filter((event: GitHubEvent) => event.type === "PushEvent")
        const pullRequestEvents = eventsData.filter((event: GitHubEvent) => event.type === "PullRequestEvent")
        setTotalPushes(pushEvents.length)
        setTotalPRs(pullRequestEvents.length)

        // Fetch real contribution data from Next.js API route
        const contribRes = await fetch("/api/github-contributions")
        const contribData = await contribRes.json()
        const weeks = contribData.weeks || []
        setTotalContributions(contribData.totalContributions || 0)
        // Map to ContributionWeek[]
        const mappedWeeks: ContributionWeek[] = weeks.map((week: any) => ({
          contributionDays: week.contributionDays.map((day: any) => ({
            date: day.date,
            count: day.contributionCount,
            level:
              day.contributionCount === 0
                ? 0
                : day.contributionCount < 3
                ? 1
                : day.contributionCount < 6
                ? 2
                : day.contributionCount < 10
                ? 3
                : 4,
            color: day.color, // Pass color from API
          })),
        }))
        setContributions(mappedWeeks)
      } catch (error) {
        console.error("Error fetching GitHub data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchGitHubData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="w-4 h-4" />
      case "CreateEvent":
        return <Star className="w-4 h-4" />
      default:
        return <Github className="w-4 h-4" />
    }
  }

  const getEventDescription = (event: GitHubEvent) => {
    switch (event.type) {
      case "PushEvent":
        const commitCount = event.payload.commits?.length || 0
        return `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${event.repo.name}`
      case "CreateEvent":
        return `Created ${event.payload.ref_type} in ${event.repo.name}`
      case "WatchEvent":
        return `Starred ${event.repo.name}`
      case "ForkEvent":
        return `Forked ${event.repo.name}`
      default:
        return `${event.type.replace("Event", "")} in ${event.repo.name}`
    }
  }

  const getContributionColor = (level: number) => {
    const colors = {
      0: "bg-muted/30",
      1: "bg-primary/20",
      2: "bg-primary/40",
      3: "bg-primary/60",
      4: "bg-primary/80",
    }
    return colors[level as keyof typeof colors] || colors[0]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* GitHub Stats */}
      {stats && (
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.public_repos}</div>
                <div className="text-sm text-muted-foreground">Repositories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{totalContributions}</div>
                <div className="text-sm text-muted-foreground">Total Commits (last year)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contribution Graph */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Contribution Graph
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{totalContributions} contributions in the last year</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div key={level} className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-end">
              {/* Weekday labels */}
              <div className="flex flex-col justify-between h-[112px] py-1 mr-1 text-xs text-muted-foreground select-none">
                {["Mon", "Wed", "Fri"].map((day, i) => (
                  <span key={i} style={{ marginTop: i === 0 ? 0 : 32 }}>{day}</span>
                ))}
              </div>
              {/* Contribution squares */}
              <div className="grid grid-flow-col gap-[2px] min-w-max">
                {contributions.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-rows-7 gap-[2px]">
                    {week.contributionDays.map((day, dayIndex) => (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                        className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${getContributionColor(day.level)} cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all`}
                        title={`${day.count} contributions on ${day.date}`}
                        style={{ backgroundColor: day.color }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.slice(0, 8).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg glass hover:glass-strong transition-all duration-200"
              >
                <div className="text-primary mt-1">{getEventIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">{getEventDescription(event)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{formatDate(event.created_at)}</span>
                    <Badge variant="outline" className="text-xs">
                      {event.type.replace("Event", "")}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
