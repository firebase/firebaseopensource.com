<template>
  <HomePage
    :platform="platform"
    :categories="categories"
  />
</template>

<script setup lang="ts">
const route = useRoute('platform-id')
const platform = route.params.id
const { data: categories } = await useAsyncData(`platform/${platform}`, async () => {
  const categories = await getCategories(platform)
  return await Promise.all(
    categories.map(async (category) => {
      const projects = await getProjectConfigs(category, 100)
      return { ...category, projects }
    }),
  )
})
</script>
