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
      <Sidebar :sidebar="sidebar" />
      <div class="sections col_main">
        <TitleSection :sections="sections" :project-config="projectConfig" :project-content="projectContent" :info="info" />

        <!-- All h2 sections -->

        <SectionH2
          v-for="section in sections"
          :key="section.id"
          :section="section"
        />

        <!-- Page footer -->
        <div
          class="
          section
          footer"
        >
          <div class="content">
            This page was generated approximately
            {{ lastFetchedFromNow }} ago.
            <br>For copyright and
            licensing details please see the
            <a
              :href="
                `https://github.com/${info.org}/${info.repo}/blob/master/LICENSE`
              "
            >LICENSE</a>
            file.
          </div>
        </div>
      </div>

      <div class="col_gutter" />
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="scss">
@import './style.scss';
</style>
