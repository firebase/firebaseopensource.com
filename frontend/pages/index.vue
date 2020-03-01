<template>
  <homepage :platform="platform" :categories="categories" :recent-releases="recentReleases" />
</template>

<script lang="ts">
import { getRecentReleases, getCategories, getProjectConfigs } from '../assets/firebaseUtils'
import Homepage from '@/components/Homepage/index.vue'

export default {
  components: {
    Homepage
  },

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
  },

  data: () => ({
    platform: 'all'

  })
}

</script>
