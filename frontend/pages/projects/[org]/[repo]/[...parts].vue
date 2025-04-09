<template>
  <ProjectDetail
    v-if="!redirectTo"
    :project-config="config!"
    :project-content="content!"
    :env="env"
    :subpage-id="subpageId"
    :page-title="pageTitle"
  />
</template>

<script setup lang="ts">
definePageMeta({
  alias: ['/projects-staging/:org/:repo/:parts*'],
})

const route = useRoute('projects-org-repo-parts')
const org = route.params.org
const repo = route.params.repo
const subpageId = route.params.parts?.join?.('::')

const id = [org, repo].join('::')

const env = route.path.includes('-staging') ? Env.STAGING : Env.PROD
const isStaging = env === Env.STAGING

if (isStaging) {
  useHead({
    meta: [
      { 'http-equiv': 'Cache-Control', 'content': 'no-store' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  })
  onMounted(() => {
    refreshConfig()
    refreshContent()
  })
}

const [
  { data: config, refresh: refreshConfig },
  { data: content, refresh: refreshContent },
] = await Promise.all([
  useAsyncData(`projects${isStaging ? '-staging' : ''}/${org}/${repo}`, () => getProjectConfig(id, env)),
  useAsyncData(`projects${isStaging ? '-staging' : ''}/${org}/${repo}/${subpageId || ':README'}`, () =>
    subpageId ? getSubpage(id, env, subpageId) : getProjectContent(id, env),
  ),
])

let pageTitle = ''
let redirectTo: string | undefined

if (config.value && content.value) {
  pageTitle = calculatePageTitle(content.value, config.value, repo)
}
else {
  // TODO do something better
  redirectTo = `http://github.com/${org}/${repo}`
  navigateTo(redirectTo, { external: true })
}
</script>
