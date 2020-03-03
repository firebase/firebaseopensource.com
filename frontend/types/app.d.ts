import { StoredProjectConfig } from '~/shared/types'

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
    projects: StoredProjectConfig[]
    featured: StoredProjectConfig[]
  }

type Section = {
  content?: String
  name?: String
  id?: String
  ref?: String
}
