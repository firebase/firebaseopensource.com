<template>
    <div class="content">
      <div class="section-card-title">
        <NuxtLink :to="`/platform/${category.platform}`">
          <span>
            <i class="material-icons">{{ category.icon }}</i>{{ category.title }}
          </span>
        </NuxtLink>
        <NuxtLink :to="`/platform/${category.platform}`">
          <button v-if="onHomepage" class="button-right">
            SEE ALL
          </button>
        </NuxtLink>
      </div>
      <div class="projects flexible-columns">
        <ProjectPreview v-for="(project, index) in category.projects" :key="project.id" :project="project" :category-index="categoryIndex" :project-index="index" />
      </div>
      <div class="antiline" />
    </div>
  </template>
  
  <script setup lang="ts">
    const {
        category,
        categoryIndex,
    } = defineProps({
        category: { required: true, type: Object, },
        categoryIndex: { required: true, type: Number, },
    })
  
    const route = useRoute()
  
    const onHomepage = route.path === '/';
  
  </script>
  
  <style lang="scss" scoped>
  .antiline {
    width: 100%;
    height: 1px;
    background-color: white;
    position: relative;
    top: -1px;
  }
  </style>
  