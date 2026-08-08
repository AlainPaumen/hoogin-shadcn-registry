import { execSync } from "node:child_process"

const TAG_PATTERN = /^v\d+\.\d+\.\d+$/

function git(args: string): string {
  return execSync(`git ${args}`, { encoding: "utf8" }).trim()
}

function bump(major: number, minor: number, patch: number, messages: string[]) {
  const breaking = messages.some(
    (m) => m.includes("BREAKING CHANGE:") || /!:\s/.test(m)
  )
  const feat = messages.some((m) => /^feat(\(|:|!)/.test(m))
  const fix = messages.some((m) => /^fix(\(|:|!)/.test(m))

  if (breaking && major > 0) return [major + 1, 0, 0] as const
  if (breaking || feat) return [major, minor + 1, 0] as const
  if (fix) return [major, minor, patch + 1] as const
  return [major, minor, patch] as const
}

const hasTag = git(`tag --list "v[0-9]*.[0-9]*.[0-9]*"`).length > 0
const latestTag = hasTag
  ? git("describe --tags --abbrev=0")
  : null
const [major, minor, patch] = latestTag && TAG_PATTERN.test(latestTag)
  ? latestTag.slice(1).split(".").map(Number)
  : [0, 0, 0]

const range = latestTag ? `${latestTag}..HEAD` : "HEAD"
const messages = git(`log ${range} --format=%s%n%b`).split("\n")
const [nextMajor, nextMinor, nextPatch] = bump(major, minor, patch, messages)

process.stdout.write(`${nextMajor}.${nextMinor}.${nextPatch}`)
