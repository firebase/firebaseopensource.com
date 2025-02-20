<template>
  <ProjectDetail
    v-if="!redirectTo"
    :project-config="config!"
    :project-content="content!"
    :env="env"
    :subpage-id="null"
    :page-title="pageTitle"
  />
</template>

<script setup lang="ts">
const route = useRoute('projects-org-repo')
const org = route.params.org!
const repo = route.params.repo!

const id = [org, repo].join('::')

const env = route.path.includes('-staging') ? Env.STAGING : Env.PROD

const [{ data: config }, { data: content }] = await Promise.all([
  useAsyncData(`projects/${org}/${repo}`, () => getProjectConfig(id, env)),
  useAsyncData(`projects/${org}/${repo}:content`, () => getProjectContent(id, env)),
])

let pageTitle = ''
let redirectTo: string | undefined

if (config.value && content.value) {
  pageTitle = calculatePageTitle(content.value, config.value, repo)
}
else {
  redirectTo = `http://github.com/${org}/${repo}`
  navigateTo(redirectTo, { external: true })
}
</script>
