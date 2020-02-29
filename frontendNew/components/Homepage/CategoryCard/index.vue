<template>
  <div class="content">
    <div class="section-title">
      <nuxt-link :to="`/platform/${category.platform}`">
        <span>
          <i class="material-icons">{{ category.icon }}</i>{{ category.title }}
        </span>
      </nuxt-link>
      <nuxt-link :to="`/platform/${category.platform}`">
        <button v-if="onHomepage()" class="button-right">
          SEE ALL
        </button>
      </nuxt-link>
    </div>
    <div class="projects flexible-columns">
      <projectItem v-for="(project, index) in category.projects" :key="project.id" :project="project" :category-index="categoryIndex" :project-index="index" />
    </div>
    <div class="antiline" />
  </div>
</template>

<script>
import ProjectItem from './ProjectItem'

export default {
  components: {
    ProjectItem
  },
  props: {
    category: {
      type: Object,
      required: true
    },
    categoryIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    onHomepage () {
      return this.$route.path === '/'
    }
  }
}
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
