import type { ProjectConfig } from '~/shared/types'

type Tab = { link: string, text: string }

type ProjectInfo = {
  org: string
  repo: string
  stars: number
}

type Category = {
  title: string
  platform: string
  icon: string
  projects: ProjectConfig[]
  featured: ProjectConfig[]
}

type Section = {
  content?: string
  name?: string
  id?: string
  ref?: string
}

type BlueBadge = {
  href: string
  icon: string
  value: string
  classes: string
}
