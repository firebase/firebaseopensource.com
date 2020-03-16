<template>
  <div class="section-card">
    <div :id="section.id" class="section-marker" :name="section.name" />
    <div class="content">
      <h2>{{ section.name }}</h2>
      <div class="html-content" v-html="cleanContent" />
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { PageSection } from '../../../../shared/types'

@Component
export default class SidebarSectionH2Component extends Vue {
  @Prop() section!: PageSection

  get cleanContent () {
    // Removes .md ending of all links that end with .md">
    return this.section.content.replace(/.md">/g, '">')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.section-card {
  width: 100%;

  margin: 0 auto 0;

  .content {
    padding: 0px 32px 24px 32px;
  }

  h1 {
    padding: 16px 0px 0px 0px;
    margin: 0px;
    line-height: 1.1em;
  }

  h2 {
    font-weight: 300;
    font-size: 24px;
    line-height: 32px;
    color: #212121;
    border-bottom: 1px solid $gray;
  }

  h3 {
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    color: #212121;
  }

  h4 {
    font-weight: 400;
    font-size: 18px;
    line-height: 32px;
    color: #212121;
  }

  h5 {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #212121;
  }
}

.section-marker {
  position: relative;
  top: -150px;
}
</style>
