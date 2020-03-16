<template>
  <Homepage platform="all" :categories="categories" :recent-releases="recentReleases" />
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'nuxt-property-decorator'
import { getRecentReleases, getCategories, getProjectConfigs } from '../assets/dbUtils'
import Homepage from '@/components/Homepage/index.vue'

@Component({
  components: { Homepage },
  async asyncData (context: any) {
    try {
      const recentReleases = await getRecentReleases(3)

      const categories = getCategories()
      const enrichedCategories = []
      for (const category of categories) {
        category.projects = await getProjectConfigs(category, 6)
        enrichedCategories.push(category)
      }

      return {
        recentReleases,
        categories: enrichedCategories
      }
    } catch (e) {
      console.error(e)
      context.error({ statusCode: 404, message: 'Platform not found' })
    }
  }
})
export default class MainPage extends Vue {
}

</script>
