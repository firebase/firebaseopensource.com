<template>
    <ProjectDetail v-if="!data.redirectTo" :project-config="data.projectConfig" :project-content="data.pageContent" :env="env" :subpage-id="subpageId"
    :page-title="data.pageTitle" />
</template>

<script setup lang="ts">

    const route = useRoute();
    const org = route.params.org;
    const repo = route.params.repo;
    const subpageId = route.params.parts.join("::");

    const id = [org, repo].join('::');

    const env = route.path.includes('-staging') ? Env.STAGING : Env.PROD;

    const { data } = await useAsyncData(`projects/${org}/${repo}/${route.params.parts.join("/")}`, async () => {
        const [
            projectConfig,
            pageContent
        ] = await Promise.all([
            getProjectConfig(id, env),
            getSubpage(id, env, subpageId),
        ]);

        if (!projectConfig || !pageContent) {
            return {
                redirectTo: `https://github.com/${org}/${repo}`,
            }
        }

        return {
            projectConfig,
            pageContent,
            pageTitle: calculatePageTitle(pageContent, projectConfig, repo!)
        }
    });

    if (data.value.redirectTo) {
        navigateTo(data.value.redirectTo, { external: true });
    }

</script>
