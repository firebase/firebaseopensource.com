// @ts-nocheck
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

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
import PageFooter from './PageFooter'

import HeaderBar from '@/components/_Shared/HeaderBar'

import { Util } from '~/../shared/util'
import { SelectableLink } from '@/assets/js/classes'

const BLOCKED_SECTIONS = ['table of contents']

@Component({
  components: { HeaderBar, Sidebar, TitleSection, SectionH2, PageFooter }
})
export default class Projects extends Vue implements ProjectArgs {
  $route: Route

  @Prop()
  projectConfig: StoredProjectConfig

  @Prop()
  projectContent: PageContent

  @Prop()
  env: Env

  @Prop()
  subpageId: String

  @Prop()
  pageTitle: String

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
