<template>
    <HomePage :platform="platform" :categories="data.categories" />
</template>

<script setup lang="ts">
    const route = useRoute();
    const platform = route.params.id;
    const { data } = await useAsyncData(`platform/${platform}`, async () => {
        
        const categories = await getCategories(platform)

        await Promise.all(
            categories.map(async (category) => {
                category.projects = await getProjectConfigs(category, 100);
                return category;
            })
        );

        return { categories }
    });
</script>