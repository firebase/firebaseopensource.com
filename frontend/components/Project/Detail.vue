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
      <ProjectSidebar
        :project-config="projectConfig"
        :project-content="projectContent"
        :project-path="projectPath"
      />
      <div class="col_main">
        <ProjectTitle
          :sections="sections"
          :project-config="projectConfig"
          :project-content="projectContent"
          :info="info"
          :subpage-id="subpageId"
          :page-title="pageTitle"
        />

        <ProjectSection
          v-for="section in sections"
          :key="section.id"
          :section="section"
        />

        <!-- Page footer -->
        <ProjectFooter
          :info="info"
          :project-config="projectConfig"
        />
      </div>

      <div class="col_gutter" />
    </div>
  </div>
</template>

<script setup lang="ts">
const BLOCKED_SECTIONS = ['table of contents']

const {
  projectConfig,
  projectContent,
  env,
  subpageId,
  pageTitle,
} = defineProps<{
  projectConfig: ProjectConfig|Readonly<ProjectConfig>,
  projectContent: PageContent|Readonly<PageContent>,
  env?: string|null,
  subpageId?: string|null,
  pageTitle: string,
}>()

useHead({
  title: pageTitle,
  meta: [
    {
      property: 'og:title',
      content: pageTitle,
    },
  ],
  script: [
    { src: 'https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js', defer: true },
  ],
})

function getSections(): Section[] {
  const sections: Section[] = []
  projectContent.sections.forEach((section) => {
    if (BLOCKED_SECTIONS.includes(section.name.toLowerCase())) {
      return
    }
    section.id = section.name.toLowerCase().replace(' ', '_')
    section.ref = '#' + section.id
    sections.push(section)
  })
  return sections
}

const sections = getSections()

const parsedIdObj = Util.parseProjectId(projectConfig.id!)

const org = parsedIdObj.owner
const repo = parsedIdObj.repo
const info = {
  org,
  repo,
  stars: projectConfig.stars,
}

const projectPath = `/projects/${org}/${repo}`.toLowerCase()

const isStaging = env === Env.STAGING

function getSubheaderTabs() {
  const tabs = [
    new SelectableLink('Guides', projectPath, false),
    new SelectableLink(
      'GitHub',
      `https://github.com/${org}/${repo}`,
      true,
    ),
  ]
  if (projectConfig.tabs) {
    projectConfig.tabs.forEach((tab) => {
      tabs.push(
        new SelectableLink(tab.title, tab.href, true),
      )
    })
  }
  return tabs
}

const subheaderTabs = getSubheaderTabs()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

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
