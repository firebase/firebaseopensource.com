// @ts-nocheck
import { Env } from '../../../../../shared/types'
import Projects from '@/components/Projects'
import { getProjectConfig, getProjectContent } from '@/assets/js/firebaseUtils'

export default {
  components: {
    Projects
  },

  async asyncData (context: any) {
    let env = Env.PROD
    if (context.route.path.includes('-staging')) {
      env = Env.STAGING
    }
    const org = context.params.org
    const repo = context.params.repo
    const id = [org, repo].join('::')

    try {
      const projectConfig = await getProjectConfig(id, env)
      const projectContent = await getProjectContent(id, env)

      if (!projectConfig || !projectContent) {
        context.error({ statusCode: 404, message: 'Project not found' })
      }
      return {
        projectConfig,
        projectContent,
        env

      }
    } catch (e) {
      console.error(e)
      context.error({ statusCode: 404, message: 'Something went wrong.' })
    }
  },

  head () {
    const head = {
      meta: [
        {
          property: 'og:image',
          content: 'https://firebaseopensource.com/logo-small.png'
        },
        {
          property: 'og:site_name',
          content: 'Firebase Open Source'
        },
        {
          property: 'og:type',
          content: 'object'
        },
        {
          property: 'og:description',
          content: 'Check out this project on firebaseopensource.com!'
        }
      ]
    } as any

    if (this.pageTitle) {
      head.title = this.pageTitle
      head.meta.push({
        property: 'og:title',
        content: this.pageTitle
      })
    }

    return head
  }
}
