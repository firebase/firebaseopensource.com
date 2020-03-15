<template>
  <div class="content">
    <div class="section-card-title">
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

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Route } from 'vue-router'
import { Category } from '../../../types/app'
import ProjectItem from './ProjectItem/index.vue'

@Component({
  components: { ProjectItem }
})
export default class CategoryCardComponent extends Vue {
  @Prop() category!: Category
  @Prop() categoryIndex!: number

  $route: Route

  onHomepage () {
    return this.$route.path === '/'
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
