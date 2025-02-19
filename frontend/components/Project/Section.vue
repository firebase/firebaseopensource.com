<template>
  <div class="section-card">
    <div
      :id="section.id"
      class="section-marker"
      :name="section.name"
    />
    <div class="content">
      <h2>{{ section.name }}</h2>
      <!-- eslint-disable vue/no-v-html -->
      <div v-html="DOMPurify.sanitize(section.content)" />
      <!-- eslint-enable -->
    </div>
  </div>
</template>

<script setup lang="ts">
import DOMPurify from 'isomorphic-dompurify'

const { section } = defineProps({ section: { required: true, type: Object } })
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

::v-deep ul {
  list-style-type: disc;
  padding-left: 20px;
}
::v-deep hr {
  height: 0.25em;
  padding: 0;
  margin-top: 12px;
  margin-bottom: 12px;
  background-color: $gray;
  border: 0;
}

::v-deep h3 {
  font-weight: 400;
  line-height: 32px;
  color: #212121;
}

::v-deep table {
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
