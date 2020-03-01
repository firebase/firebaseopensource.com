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

function removeLastForwardSlash (string) {
  if (!string) {
    return null
  }
  return string.replace(/\/$/, '')
}

function getCleanParams (params) {
  const org = removeLastForwardSlash(params.org)
  let repo = removeLastForwardSlash(params.repo)
  let pathMatch = removeLastForwardSlash(params.pathMatch)
  let subpageId = null

  if (pathMatch && !repo) {
    repo = pathMatch
    pathMatch = null
  }

  if (pathMatch) {
    subpageId = pathMatch.split('/')
      .join('::')
      .toLowerCase()
  }

  return {
    org,
    repo,
    subpageId
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

    const cleanParams = getCleanParams(context.params)

    const org = cleanParams.org
    const repo = cleanParams.repo
    const subpageId = cleanParams.subpageId
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
        return context.error({ statusCode: 404, message: 'Project not found.' })
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
