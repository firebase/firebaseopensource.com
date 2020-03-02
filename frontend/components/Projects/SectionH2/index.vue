<template>
  <div class="section">
    <div :id="section.id" class="section-marker" :name="section.name" />
    <div class="content">
      <h2>{{ section.name }}</h2>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="section.content" />
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class SidebarSectionH2Component extends Vue {
  @Prop() section!: any // TODO
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.section {
    margin: 30px auto 0;
    width: 100%;

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
</style>
