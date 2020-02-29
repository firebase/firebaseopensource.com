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
        <TitleSection :sections="sections" :project-config="projectConfig" :project-content="projectContent" :info="info" :subpage-id="subpageId" />

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

<script src="./index.ts" lang="ts"></script>

<style lang="scss">
@import './style.scss';
</style>
