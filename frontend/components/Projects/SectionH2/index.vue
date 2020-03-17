<template>
  <div class="section-card">
    <div :id="section.id" class="section-marker" :name="section.name" />
    <div class="content">
      <h2>{{ section.name }}</h2>
      <div v-html="section.content" />
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
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

/** /deep/ is needed because of scoped styles
* otherwide don't apply within v-html content
*/
/deep/ ul {
  list-style-type: disc;
  padding-left: 20px;
}
/deep/ hr {
  height: 0.25em;
  padding: 0;
  margin-top: 12px;
  margin-bottom: 12px;
  background-color: $gray;
  border: 0;
}

/deep/ h3 {
  font-weight: 400;
  line-height: 32px;
  color: #212121;
}

/deep/ table {
  display: block;
  width: 100%;
  overflow: auto;
}

.section-card {
  width: 100%;
  margin: 0 auto 0;
}

.content {
  padding: 0px 32px 24px 32px;
}

h2 {
    font-weight: 300;
    font-size: 24px;
    line-height: 32px;
    color: #212121;
    border-bottom: 1px solid $gray;
}

.section-marker {
  position: relative;
  top: -150px;
}
</style>
