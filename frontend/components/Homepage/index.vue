<template>
  <div id="homepage">
    <HeaderBar
      ref="header"
      enable-subheader
      subheader-title="Platforms"
      :subheader-tabs="subheaderTabs"
      :subheader-tab-selection="platform"
    />

    <div class="page content_grid">
      <div class="col_gutter" />
      <div class="sections col_main">
        <welcomeCard />

        <div v-if="$route.path === '/'" class="section">
          <div id="recent_releases" class="content">
            <div class="section-title">
              <span> <i class="material-icons">event</i>Recent Releases </span>
            </div>
            <div class="releases flexible-columns">
              <div v-for="release in recentReleases" :key="release.name" class="release">
                <releaseItem :release="release" />
              </div>
            </div>
          </div>
        </div>

        <div v-for="(category, index) in categories" :key="category.title" class="section">
          <categoryCard v-if="isSectionVisible(category.platform)" :category="category" :category-index="index" />
        </div>
      </div>
      <div class="col_gutter" />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import ReleaseItem from './ReleaseItem'
import CategoryCard from './CategoryCard'
import WelcomeCard from './WelcomeCard'
import { RepoRelease } from '~/../shared/types'

import HeaderBar from '@/components/_Shared/HeaderBar'

@Component({
  components: { HeaderBar, ReleaseItem, CategoryCard, WelcomeCard }
})

export default class Homepage extends Vue {
  subheaderTabs: any[] = [
    { title: 'All', href: '/' },
    { title: 'iOS', href: '/platform/ios' },
    { title: 'Android', href: '/platform/android' },
    { title: 'Web', href: '/platform/web' },
    { title: 'Admin', href: '/platform/admin' },
    { title: 'Games', href: '/platform/games' }
  ]

  @Prop()
  platform: string

  @Prop()
  categories: Category[]

  @Prop()
  recentReleases: RepoRelease[]

  isSectionVisible (section: string) {
    if (!this.platform || this.platform === 'all') {
      return true
    }

    return section === this.platform
  }
}

</script>

<style lang="scss" scoped>
</style>
