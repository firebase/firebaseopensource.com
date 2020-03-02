<template>
  <div class="dropdown">
    <span>Contents</span>
    <nuxt-link
      v-for="section in sections"
      :key="section.id"
      :to="section.ref"
      class="ellipsize"
    >
      {{ section.name }}
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TableOfContentsComponent extends Vue {
  @Prop() sections!: []
}
</script>

<style lang="scss" scoped>

</style>
