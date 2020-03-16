<template>
  <div id="projects">
    <HeaderBar
      ref="header"
      :enable-subheader="true"
      subheader-title="Documentation"
      :subheader-tabs="subheaderTabs"
    />

    <StagingWarning v-if="isStaging" />

    <div class="page content_grid">
      <Sidebar :project-config="projectConfig" :project-content="projectContent" :project-path="projectPath" />
      <div class="col_main">
        <TitleSection
          :sections="sections"
          :project-config="projectConfig"
          :project-content="projectContent"
          :info="info"
          :subpage-id="subpageId"
          :page-title="pageTitle"
        />

        <SectionH2
          v-for="section in sections"
          :key="section.id"
          :section="section"
        />

        <!-- Page footer -->
        <PageFooter :info="info" :project-config="projectConfig" />
      </div>

      <div class="col_gutter" />
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import { Util } from '../../../shared/util'
import {
  Env,
  ProjectConfig,
  TabConfig,
  PageContent
} from '../../../shared/types'
import { SelectableLink } from '../../assets/classes'
import { Section } from '../../types/app'
import Sidebar from './Sidebar/index.vue'
import TitleSection from './TitleSection/index.vue'
import SectionH2 from './SectionH2/index.vue'
import PageFooter from './PageFooter/index.vue'
import StagingWarning from './StagingWarning/index.vue'

import HeaderBar from '@/components/_Shared/HeaderBar/index.vue'

const BLOCKED_SECTIONS = ['table of contents']

@Component({
  components: { HeaderBar, Sidebar, TitleSection, SectionH2, PageFooter, StagingWarning }
})
export default class Projects extends Vue {
  @Prop() projectConfig!: ProjectConfig
  @Prop() projectContent!: PageContent
  @Prop() env: Env
  @Prop() subpageId: String
  @Prop() pageTitle!: String

  get sections (): Section[] {
    const sections : Section[] = []
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
    return Util.parseProjectId(this.projectConfig.id!)
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
      new SelectableLink('Guides', this.projectPath, false),
      new SelectableLink(
        'GitHub',
      `https://github.com/${this.org}/${this.repo}`,
      true
      )
    ]
    if (this.projectConfig.tabs) {
      this.projectConfig.tabs.forEach((tab: TabConfig) => {
        tabs.push(
          new SelectableLink(tab.title, tab.href, true)
        )
      })
    }
    return tabs
  }
}

</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.warning {
  background: #ff8a65;
  text-align: center;
  color: white;
  padding-top: 8px;
  padding-bottom: 8px;
}

.icon {
  //font-size: 100px;
  background-color: #eee;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  padding-top: 10px;
  border-radius: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>
