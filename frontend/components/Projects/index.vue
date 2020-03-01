<template>
  <div id="projects">
    <img src="/background-top.svg" hidden>

    <HeaderBar
      ref="header"
      enable-subheader
      subheader-title="Documentation"
      :subheader-tabs="subheaderTabs"
    />

    <div v-if="isStaging" class="warning">
      You are viewing this page in the STAGING environment.
    </div>

    <div class="page content_grid">
      <Sidebar :project-config="projectConfig" :project-content="projectContent" :project-path="projectPath" />
      <div class="sections col_main">
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
// @ts-nocheck
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import Sidebar from './Sidebar'
import TitleSection from './TitleSection'
import SectionH2 from './SectionH2'
import PageFooter from './PageFooter'
import {
  Env,
  StoredProjectConfig,
  TabConfig,
  PageContent
} from '~/../shared/types'

import HeaderBar from '@/components/_Shared/HeaderBar'

import { Util } from '~/../shared/util'
import { SelectableLink } from '~/assets/classes'

const BLOCKED_SECTIONS = ['table of contents']

@Component({
  components: { HeaderBar, Sidebar, TitleSection, SectionH2, PageFooter }
})
export default class Projects extends Vue implements ProjectArgs {
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

</script>

<style lang="scss">
@import '@/assets/styles/base.scss';
@import '@/assets/styles/variables.scss';

#projects {
  .warning {
    background: #ff8a65;
    text-align: center;
    color: white;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  // TODO: Make the margin-top unbreakable
  // TODO: Hide in mobile
  .sidebar {
    float: right;
    width: $sidebar-width;
    background: #ffffff;
    margin-top: 30px;
    list-style-type: none;
    padding: 0px;

    .subsection {
      list-style-type: none;
      font-size: 13px;
      line-height: 16px;

      padding-top: 8px;
      padding-left: 16px;

      li {
        padding-top: 3px;
        padding-bottom: 3px;
      }

      a {
        color: #212121;
      }

      a:hover {
        color: #039be5;
        cursor: pointer;
      }

      a.selected {
        color: #039be5;
        font-weight: bold;
      }
    }
  }

  hr {
    height: 0.25em;
    padding: 0;
    margin-top: 12px;
    margin-bottom: 12px;
    background-color: $gray;
    border: 0;
  }

  hr:last-child {
    margin-top: 24px;
    margin-bottom: 0px;
  }

  ul {
    list-style-type: disc;
    padding-left: 20px;
  }

  .body-column {
    display: grid;
    grid-template-columns: minmax(50%, max-content) 1fr;
    grid-template-areas:
      'left right'
      'content content';
    grid-gap: 12px;

    min-height: 80px;

    > .header_content {
      grid-area: content;

      p:last-of-type {
        margin: 0px;
      }

      &:first-of-type {
        margin-top: 0px;
      }
    }

    @media (max-width: $tablet) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'left'
        'right'
        'content';
      grid-gap: 0px;
    }
  }

  .badges {
    margin-top: 16px;
    display: grid;
    grid-auto-columns: max-content;
    grid-template-areas:
      'button button'
      'button button'
      'copy copy';
    grid-gap: 6px;

    float: right;
    @media (max-width: $tablet) {
      float: left;
      margin-bottom: 8px;
    }

    .badge {
      border-radius: 3px;
      overflow: hidden;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
      font-size: 0.9em;
      text-align: center;
      padding: 5px 16px 0px 16px;
      font-weight: bold;

      background-color: $blue;
      color: white;
      * {
        height: 30px;
      }
      .key {
        display: inline;
        margin-right: 2px;

        .material-icons {
          font-size: 18px;
          position: relative;
          top: 4px;
          width: 18px;
        }
      }
      .value {
        display: inline;
      }

      transition: box-shadow 0.2s;
    }

    .badge:hover {
      box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.25);
    }

    .badge-action {
      color: lighten($blue, 10%);
      background-color: white;

      // Action buttons are not relevant on a phone
      @media (max-width: $phone) {
        display: none;
      }
    }
  }

  .related {
    width: 100%;
    overflow: hidden;
    margin-top: 16px;

    .title {
      margin-right: 10px;
    }
    .repo {
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 100px;
      padding: 0px 14px;
      float: left;
      font-size: 0.8em;
      margin-right: 10px;
      margin-bottom: 4px;

      align-items: center;
      color: black;
      opacity: 0.5;

      .material-icons {
        margin-right: 8px;
        font-size: 1.5em;
        position: relative;
        top: 5px;
      }

      transition: 0.2s;
      &:hover {
        cursor: pointer;
        background-color: $yellow;
        color: darken($yellow, 50%);
        border: 1px solid darken($yellow, 5%);
        opacity: 1;
      }
    }
  }

  .copy-code-container {
    position: relative;
    clear: both;

    grid-area: copy;
    input {
      width: 100%;
      height: 30px;
      margin-top: 5px;

      font-family: monospace;
      padding: 3px 40px 3px 6px;
      box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      border: 1px solid #d1d5da;
    }

    button {
      height: 30px;

      position: absolute;
      right: 0px;
      bottom: 0px;

      border: 1px solid #bbb;
      background-color: #eee;

      .material-icons {
        overflow: hidden;
        line-height: 20px;
        display: block;
        font-size: 20px;
      }
    }
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

  img[hidden] {
    display: none;
  }

  .label-icon {
    opacity: 0.4;
    margin-left: 7px;
  }

  .section-marker {
    position: relative;
    top: -150px;
  }

  .dropdown a.selected {
    font-weight: bold;
  }

  .section {
    > .content {
      padding: 0px 32px 24px 32px;
    }

    &.title-section {
      > .content {
        padding-top: 24px;
      }

      .img-badge {
        display: none;
      }
    }

    &.footer {
      margin-top: 10px;
      > .content {
        padding-top: 24px;
        text-align: center;
        color: #aaa;
        font-size: 0.8em;
      }
    }
  }

}
</style>
