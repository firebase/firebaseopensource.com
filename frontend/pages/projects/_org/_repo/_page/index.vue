<template>
  <projects
    :project-config="projectConfig"
    :project-content="projectContent"
    :env="env"
    :subpage-id="subpageId"
    :page-title="pageTitle"
  />
</template>

<script lang="ts">
// @ts-nocheck
import { Env } from '~/../shared/types'
import Projects from '@/components/Projects'
import { getProjectConfig, getProjectContent, getSubpage } from '~/assets/firebaseUtils'

function calculatePageTitle (projectContent, pageContent, repo) {
  // Choose the page name depending on available info:
  // Option 0 - title of the header section
  // Option 1 - the name from the config.
  // Option 2 - the repo name
  if (projectContent.header.name) {
    return projectContent.header.name
  } else if (pageContent.name) {
    return pageContent.name
  } else {
    return repo
  }
}

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
    const subpageId = context.params.page
    const id = [org, repo].join('::')

    try {
      const projectConfig = await getProjectConfig(id, env)
      let pageContent
      if (subpageId) {
        pageContent = await getSubpage(id, env, subpageId)
      } else {
        pageContent = await getProjectContent(id, env)
      }

      if (!projectConfig || !pageContent) {
        context.error({ statusCode: 404, message: 'Project not found' })
      }

      return {
        projectConfig,
        projectContent: pageContent,
        env,
        subpageId,
        pageTitle: calculatePageTitle(pageContent, projectConfig, repo)
      }
    } catch (e) {
      console.error(e)
      context.error({ statusCode: 404, message: 'Something went wrong.' })
    }
  },

  data: () => ({
    pageTitle: 'Firebase Open Source'
  }),

  head () {
    const head = {
      title: this.pageTitle,
      meta: [
        {
          property: 'og:title',
          content: this.pageTitle
        }
      ]
    }
    return head
  }
}

</script>
