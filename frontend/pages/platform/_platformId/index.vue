<template>
  <Homepage :platform="platform" :categories="categories" />
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'nuxt-property-decorator'

import { getCategories, getProjectConfigs } from '../../../assets/dbUtils'
import Homepage from '@/components/Homepage/index.vue'

@Component({
  components: { Homepage },
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
})
export default class PlatformPage extends Vue {
}

</script>
