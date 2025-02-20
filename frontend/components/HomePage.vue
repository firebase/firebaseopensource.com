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
        <WelcomeCard />

        <div
          v-if="recentReleases"
          class="section-card"
        >
          <div
            id="recent_releases"
            class="content"
          >
            <div class="section-card-title">
              <span> <i class="material-icons">event</i>Recent Releases </span>
            </div>
            <div class="releases flexible-columns">
              <div
                v-for="release in recentReleases"
                :key="release.id"
                class="release"
              >
                <ReleaseItem :release="release" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-for="(category, index) in categories"
          :key="category.title"
          class="section-card"
        >
          <CategoryCard
            v-if="isSectionVisible(category.platform)"
            :category="category"
            :category-index="index"
          />
        </div>
      </div>
      <div class="col_gutter" />
    </div>
  </div>
</template>

<script setup lang="ts">
const subheaderTabs = [
  { title: 'All', href: '/' },
  { title: 'iOS', href: '/platform/ios' },
  { title: 'Android', href: '/platform/android' },
  { title: 'Web', href: '/platform/web' },
  { title: 'Admin', href: '/platform/admin' },
  { title: 'Games', href: '/platform/games' },
] as const

const {
  platform,
  categories,
  recentReleases,
} = defineProps<{
  platform?: string | null
  categories?: Array<Category> | null
  recentReleases?: Array<RepoRelease> | null
}>()

function isSectionVisible(section: string) {
  if (!platform || platform === 'all') {
    return true
  }
  return section === platform
}
</script>
