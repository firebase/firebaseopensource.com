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
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import {
  Env,
  StoredProjectConfig
} from '../../../../../shared/types'
import { getProjectConfig, getProjectContent, getSubpage } from '../../../../assets/dbUtils'

import Projects from '@/components/Projects/index.vue'

// TODO: remove :any's
function calculatePageTitle (projectContent: any, pageContent: any, repo : string) : string {
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

function cleanParam (string: string | null) : string | null {
  // Set null if
  if (!string) {
    return null
  }
  return string.replace(/\/$/, '')
}

function getCleanParams (params: ProjectRouteParams) {
  const org = cleanParam(params.org)
  let repo = cleanParam(params.repo)
  let pathMatch = cleanParam(params.pathMatch)
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

// @ts-ignore - idk why this shows "no overload matches this call..."
@Component({
  components: { Projects },
  async asyncData (context: any) {
    let env = Env.PROD
    if (context.route.path.includes('-staging')) {
      env = Env.STAGING
    }

    const cleanParams = getCleanParams(context.params)

    const org: string = cleanParams.org!
    const repo: string | null = cleanParams.repo
    const subpageId: string | null = cleanParams.subpageId
    const id = [org, repo].join('::')

    try {
      const projectConfig: StoredProjectConfig = await getProjectConfig(id, env)
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
        pageTitle: calculatePageTitle(pageContent, projectConfig, repo!)
      }
    } catch (e) {
      console.error(e)
      context.error({ statusCode: 404, message: 'Something went wrong.' })
    }
  }
})
export default class RepoPage extends Vue {
  pageTitle: string = 'Firebase Open Source'
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
