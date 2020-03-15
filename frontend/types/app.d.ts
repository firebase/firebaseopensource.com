import { ProjectConfig } from '~/shared/types'

type Tab = { link: string; text: string }

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
  content?: String
  name?: String
  id?: String
  ref?: String
}

type BlueBadge = {
  href: String
  icon: String,
  value: String,
  classes: String
}
