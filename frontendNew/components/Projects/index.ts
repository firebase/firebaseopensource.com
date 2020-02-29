// @ts-nocheck
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { formatDistanceToNow } from 'date-fns'

import { Route } from 'vue-router'

import {
  Env,
  StoredProjectConfig,
  TabConfig,
  PageContent
} from './../../../shared/types'

import Sidebar from './Sidebar'
import TitleSection from './TitleSection'
import SectionH2 from './SectionH2'
import HeaderBar from '@/components/_Shared/HeaderBar'

import { Util } from '~/../shared/util'

class SidebarSection {
  title: String = ''
  expanded: Boolean = false
  pages: SelectableLink[] = []

  constructor (title: String, pages: SelectableLink[], expanded = false) {
    this.title = title
    this.pages = pages
    this.expanded = expanded
  }
}

class SelectableLink {
  title: String = ''
  href: String = ''
  selected: Boolean = false
  outbound: Boolean = false

  constructor (title: String, href: String, selected = false, outbound = false) {
    this.title = title
    this.href = href
    this.selected = selected
    this.outbound = outbound
  }
}

const BLOCKED_SECTIONS = ['table of contents']

const OSS_SIDEBAR = new SidebarSection('Open Source', [
  new SelectableLink('Home', '/'),
  new SelectableLink(
    'Add Project',
    'https://github.com/firebase/firebaseopensource.com/issues/new?template=new_project.md',
    false,
    true
  )
])

const FIREBASE_SIDEBAR = new SidebarSection('Firebase', [
  new SelectableLink('Docs', 'https://firebase.google.com/docs/', false, true),
  new SelectableLink(
    'Console',
    'https://console.firebase.google.com/',
    false,
    true
  ),
  new SelectableLink('Blog', 'https://firebase.googleblog.com/', false, true),
  new SelectableLink(
    'YouTube',
    'https://www.youtube.com/user/Firebase',
    false,
    true
  )
])

interface RepoInfo {
  org: string
  repo: string
  stars: number
}

interface RelatedRepo {
  name: string
  path: string
}

@Component({
  components: { HeaderBar, Sidebar, TitleSection, SectionH2 }
})
export default class Projects extends Vue implements ProjectArgs {
  name = 'projects'
  $route: Route

  @Prop()
  projectConfig: StoredProjectConfig

  @Prop()
  projectContent: PageContent

  @Prop()
  env: Env

  get lastFetchedFromNow () {
    // TODO: Use -> this.projectConfig.last_fetched.toDate()
    const lastFetched = new Date(this.projectConfig.last_updated)
    return formatDistanceToNow(lastFetched)
  }

  get sections (): Section[] {
    const sections = []
    this.projectContent.sections.forEach((section) => {
      if (BLOCKED_SECTIONS.includes(section.name.toLowerCase())) {
        return
      }
      section.id = section.name.toLowerCase().replace(' ', '_')
      section.ref = '#' + section.id
      sections.push(section)
    })
    return sections
  }

  get sidebar () {
    const projectSidebar = new SidebarSection(
      'Project',
      [new SelectableLink('Home', this.projectPath, !this.projectContent.isSubpage)],
      true
    )

    const pages = this.projectConfig.pages
    if (pages && pages.testtest === 'asdasdas') {
      console.log(pages)
      const subpages: SelectableLink[] = []
      for (const pageConfig of pages) {
        let pageName
        if (pageConfig.name) {
          pageName = pageConfig.name
        } else {
          // TODO
          // pageName = pageConfig.path.toLowerCase()
          // pageName = pageName.replace('/readme.md', '')
          // pageName = pageName.replace('.md', '')
        }

        // TODO
        // const selected =
        //   page && page.toLowerCase() === pageConfig.path.toLowerCase()
        // const href = `${this.projectPath}/${pageConfig.path}`.toLowerCase()
        // subpages.push(new SelectableLink(pageName, href, selected))
      }
      projectSidebar.pages = projectSidebar.pages.concat(subpages)
    }
    return [projectSidebar, OSS_SIDEBAR, FIREBASE_SIDEBAR]
  }

  get parsedIdObj () {
    return Util.parseProjectId(this.projectConfig.id)
  }

  get info () {
    return {
      org: this.org,
      repo: this.repo,
      stars: this.projectConfig.stars
    }
  }

  get org () {
    return this.parsedIdObj.owner
  }

  get repo () {
    return this.parsedIdObj.repo
  }

  get projectPath () {
    return `/projects/${this.org}/${this.repo}`.toLowerCase()
  }

  get isStaging () {
    return this.env === Env.STAGING
  }

  get subheaderTabs () {
    const tabs = [
      new SelectableLink('Guides', this.projectPath, false, false),
      new SelectableLink(
        'GitHub',
      `https://github.com/${this.org}/${this.repo}`,
      false,
      true
      )
    ]
    if (this.projectConfig.tabs) {
      this.projectConfig.tabs.forEach((tab: TabConfig) => {
        tabs.push(
          new SelectableLink(tab.title, tab.href, false, true)
        )
      })
    }
    return tabs
  }
}
