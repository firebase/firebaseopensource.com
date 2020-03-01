import Homepage from '@/components/Homepage'
import { getRecentReleases, getCategories, getProjectConfigs } from '~/assets/firebaseUtils'

export default {
  components: {
    Homepage
  },

  data: () => ({
    platform: 'all'

  }),

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
}
