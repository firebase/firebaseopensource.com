<template>
    <ProjectDetail :project-config="data.projectConfig" :project-content="data.projectContent" :env="env" :subpage-id="subpageId"
    :page-title="data.pageTitle" />
</template>

<script setup lang="ts">

    function calculatePageTitle(pageContent: PageContent, projectConfig: ProjectConfig, repo: string): string {
        // Choose the page name depending on available info:
        // Option 0 - title of the header section
        // Option 1 - the name from the config.
        // Option 2 - the repo name
        if (pageContent.header.name) {
            return pageContent.header.name
        } else if (projectConfig.name) {
            return projectConfig.name
        } else {
            return repo
        }
    }

    type ProjectRouteParams = {
        org: string | null,
        repo: string | null,
        pathMatch: string | null,
    }

    function getCleanParams(params: string[]) {
        const org = params[0];
        const repo = params[1];
        const subpageId = params.length > 2 ? params.slice(2).join('::').toLowerCase() : null;

        return {
            org,
            repo,
            subpageId
        }
    }

    const route = useRoute();

    const {
        org,
        repo,
        subpageId,
    } = getCleanParams(route.params.page);

    const id = [org, repo].join('::');

    const env = route.path.includes('-staging') ? Env.STAGING : Env.PROD;

    const { data } = await useAsyncData(`projects/${route.params.page.join("/")}`, async () => {
        const [
            projectConfig,
            pageContent
        ] = await Promise.all([
            getProjectConfig(id, env),
            subpageId ? getSubpage(id, env, subpageId) : getProjectContent(id, env)
        ]);

        if (!projectConfig || !pageContent) {
            return context.error({ statusCode: 404, message: 'Project not found.' })
        }

        return {
            projectConfig,
            projectContent: pageContent,
            pageTitle: calculatePageTitle(pageContent, projectConfig, repo!)
        }
    });
</script>
