<template>
    <ProjectDetail v-if="!data.redirectTo" :project-config="data.projectConfig" :project-content="data.projectContent" :env="env" :subpage-id="subpageId"
    :page-title="data.pageTitle" />
</template>

<script setup lang="ts">

    const route = useRoute();
    const org = route.params.org;
    const repo = route.params.repo;

    const id = [org, repo].join('::');

    const env = route.path.includes('-staging') ? Env.STAGING : Env.PROD;

    const { data } = await useAsyncData(`projects/${org}/${repo}`, async () => {
        const [
            projectConfig,
            projectContent
        ] = await Promise.all([
            getProjectConfig(id, env),
            getProjectContent(id, env),
        ]);

        if (!projectConfig || !projectContent) {
            return {
                redirectTo: `https://github.com/${org}/${repo}`,
            }
        }

        return {
            projectConfig,
            projectContent,
            pageTitle: calculatePageTitle(projectContent, projectConfig, repo!)
        }
    });

    if (data.value.redirectTo) {
        navigateTo(data.value.redirectTo, { external: true });
    }

</script>
