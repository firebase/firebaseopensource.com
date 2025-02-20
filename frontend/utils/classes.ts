import type { ProjectConfig } from '../../shared/types'

export type Tab = { link: string, text: string }

export type HeaderTab = {
  title: string
  outbound?: boolean
  href: string
}

export type ProjectInfo = {
  org: string
  repo: string
  stars: number
}

export type Category = {
  title: string
  platform: string
  icon: string
  projects: ProjectConfig[]
  featured: ProjectConfig[]
}

export type Section = {
  content?: string
  name?: string
  id?: string
  ref?: string
}

export type BlueBadge = {
  href: string
  icon: string
  value: string
  classes: string
}

export class SidebarSection {
  title: string = ''
  pages: SelectableLink[] = []

  constructor(title: string, pages: SelectableLink[]) {
    this.title = title
    this.pages = pages
  }
}

export class SelectableLink {
  title: string = ''
  href: string = ''
  outbound: boolean = false

  constructor(title: string, href: string, outbound = false) {
    this.title = title
    this.href = href
    this.outbound = outbound
  }
}
