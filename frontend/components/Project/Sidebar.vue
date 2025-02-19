<template>
  <div class="col_gutter">
    <ul class="sidebar shadow_all">
      <ProjectSidebarCard v-for="section in sidebarData" :key="section.id" :section="section" />
    </ul>
  </div>
</template>

<script setup lang="ts">

  const OSS_SIDEBAR = new SidebarSection('Open Source', [
    new SelectableLink('Home', '/'),
    new SelectableLink(
      'Add Project',
      'https://github.com/firebase/firebaseopensource.com/issues/new?template=new_project.md',
      true
    )
  ])

  const FIREBASE_SIDEBAR = new SidebarSection('Firebase', [
    new SelectableLink('Docs', 'https://firebase.google.com/docs/', true),
    new SelectableLink(
      'Console',
      'https://console.firebase.google.com/',
      true
    ),
    new SelectableLink('Blog', 'https://firebase.googleblog.com/', true),
    new SelectableLink(
      'YouTube',
      'https://www.youtube.com/user/Firebase',
      true
    )
  ])

  const {
    projectConfig,
    projectContent,
    projectPath,
  } = defineProps({
      projectConfig: { required: true, type: Object },
      projectContent: { required: true, type: Object },
      projectPath: { required: true, type: String, },
  })

  function getSidebarData () {
    const selectableLink = new SelectableLink('Home', projectPath)
    const projectSidebar = new SidebarSection(
      'Project',
      [selectableLink]
    )

    const pages = projectConfig.pages
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

        const href = `${projectPath}/${pageConfig.path}`.toLowerCase()
        subpages.push(new SelectableLink(pageName, href))
      }
      projectSidebar.pages = projectSidebar.pages.concat(subpages)
    }
    return [projectSidebar, OSS_SIDEBAR, FIREBASE_SIDEBAR]
  }

  const sidebarData = getSidebarData();
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

// TODO: Make the margin-top unbreakable
// TODO: Hide in mobile
.sidebar {
  float: right;
  width: $sidebar-width;
  background: #ffffff;
  margin-top: 30px;
  list-style-type: none;
  padding: 0px;
}

</style>
