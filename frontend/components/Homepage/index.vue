<template>
  <div id="homepage">
    <HeaderBar
      ref="header"
      :enable-subheader="true"
      subheader-title="Platforms"
      :subheader-tabs="subheaderTabs"
      :subheader-tab-selection="platform"
    />

    <div class="page content_grid">
      <div class="col_gutter" />
      <div class="col_main">
        <welcomeCard />

        <div v-if="$route.path === '/'" class="section-card">
          <div id="recent_releases" class="content">
            <div class="section-card-title">
              <span> <i class="material-icons">event</i>Recent Releases </span>
            </div>
            <div class="releases flexible-columns">
              <div v-for="release in recentReleases" :key="release.name" class="release">
                <releaseItem :release="release" />
              </div>
            </div>
          </div>
        </div>

        <div v-for="(category, index) in categories" :key="category.title" class="section-card">
          <categoryCard v-if="isSectionVisible(category.platform)" :category="category" :category-index="index" />
        </div>
      </div>
      <div class="col_gutter" />
    </div>
  </div>
</template>

<script lang="ts">

import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import { RepoRelease } from '../../../shared/types'
import { Category } from '../../types/app'
import ReleaseItem from './ReleaseItem/index.vue'
import CategoryCard from './CategoryCard/index.vue'
import WelcomeCard from './WelcomeCard/index.vue'

import HeaderBar from '@/components/_Shared/HeaderBar/index.vue'

@Component({
  components: { HeaderBar, ReleaseItem, CategoryCard, WelcomeCard }
})
export default class HomepageComponent extends Vue {
  @Prop() platform: string
  @Prop() categories: Category[]
  @Prop() recentReleases: RepoRelease[]

  subheaderTabs: any[] = [
    { title: 'All', href: '/' },
    { title: 'iOS', href: '/platform/ios' },
    { title: 'Android', href: '/platform/android' },
    { title: 'Web', href: '/platform/web' },
    { title: 'Admin', href: '/platform/admin' },
    { title: 'Games', href: '/platform/games' }
  ]

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
