<template>
  <HomePage
    platform="all"
    :categories="data.categories"
    :recent-releases="data.recentReleases"
  />
</template>

<script setup lang="ts">
const { data } = await useAsyncData('homepage', async () => {
  const resolveRecentReleases = getRecentReleases(3)

  const categories = await getCategories()

  await Promise.all(
    categories.map(async (category) => {
      category.projects = await getProjectConfigs(category, 6)
      return category
    }),
  )

  return {
    recentReleases: await resolveRecentReleases,
    categories,
  }
})
</script>
