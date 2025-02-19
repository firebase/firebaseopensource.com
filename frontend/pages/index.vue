<template>
  <HomePage
    platform="all"
    :categories="categories"
    :recent-releases="recentReleases"
  />
</template>

<script setup lang="ts">
const [{ data: recentReleases }, { data: categories }] = await Promise.all([
  useAsyncData('recentReleases', () => getRecentReleases(3)),
  useAsyncData('categories', async () => {
    const categories = await getCategories()
    return await Promise.all(
      categories.map(async (category) => {
        const projects = await getProjectConfigs(category, 6)
        return { ...category, projects }
      }),
    )
  }),
])
</script>
