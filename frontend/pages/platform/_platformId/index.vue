<template>
  <homepage :platform="platform" :categories="categories" />
</template>

<script lang="ts">
// @ts-nocheck
import Homepage from '@/components/Homepage'
import { getCategories, getProjectConfigs } from '~/assets/firebaseUtils'

export default {
  components: {
    Homepage
  },
  async asyncData (context: any) {
    const platform = context.params.platformId

    try {
      const categories = getCategories(platform)
      const enrichedCategories = []
      for (const category of categories) {
        // TODO: Do we want the 100 limit? Add Pagination?
        category.projects = await getProjectConfigs(category, 100)
        enrichedCategories.push(category)
      }

      return {
        platform,
        categories: enrichedCategories
      }
    } catch (e) {
      console.error(e)
      context.error({ statusCode: 404, message: 'Platform not found' })
    }
  }
}

</script>
