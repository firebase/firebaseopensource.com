<template>
  <div class="col_gutter">
    <ul class="sidebar shadow_all">
      <SidebarCard v-for="section in sidebarData" :key="section.id" :section="section" />
    </ul>
  </div>
</template>

<script>
import SidebarCard from './SiderbarCard'
import {
  SidebarSection, SelectableLink
} from '@/assets/js/classes'

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

export default {
  components: {
    SidebarCard
  },
  props: {
    projectConfig: {
      type: Object,
      required: true
    },
    projectContent: {
      type: Object,
      required: true
    },
    projectPages: {
      type: Array,
      required: true
    },
    projectPath: {
      type: String,
      required: true
    }
  },
  computed: {
    sidebarData () {
      const selectableLink = new SelectableLink('Home', this.projectPath, !this.projectContent.isSubpage)
      const projectSidebar = new SidebarSection(
        'Project',
        [selectableLink],
        true
      )

      console.log('HIEER', this.$route)
      const pages = this.projectConfig.pages
      if (pages) {
        const subpages = []
        for (const pageConfig of pages) {
          let pageName
          if (pageConfig.name) {
            pageName = pageConfig.name
          } else {
            pageName = pageConfig.path.toLowerCase()
            pageName = pageName.replace('/readme.md', '')
            pageName = pageName.replace('.md', '')
          }

          const selected =
          this.page && this.page.toLowerCase() === pageConfig.path.toLowerCase()
          const href = `${this.projectPath}/${pageConfig.path}`.toLowerCase()
          subpages.push(new SelectableLink(pageName, href, selected))
        }
        projectSidebar.pages = projectSidebar.pages.concat(subpages)
      }
      return [projectSidebar, OSS_SIDEBAR, FIREBASE_SIDEBAR]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
