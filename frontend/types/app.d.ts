type Tab = { link: string; text: string }

type ProjectInfo = {
    org: string
    repo: string

    name: string
    description: string

    letter: string
    color: string
  }

type Category = {
    title: string
    platform: string
    icon: string
    projects: ProjectInfo[]
    featured: ProjectInfo[]
  }

type Section = {
  content?: String
  name?: String
  id?: String
  ref?: String
}
