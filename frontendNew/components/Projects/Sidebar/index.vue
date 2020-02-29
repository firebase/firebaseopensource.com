<template>
  <div class="col_gutter">
    <ul class="sidebar shadow_all">
      <li v-for="section in sidebar" :key="section.id" class="sidebar-section">
        <div class="header" @click="section.expanded = !section.expanded">
          <span class="title">{{ section.title }}</span>
          <i v-if="section.expanded" class="material-icons">expand_less</i>
          <i v-if="!section.expanded" class="material-icons">expand_more</i>
        </div>

        <ul v-if="section.expanded" class="subsection">
          <li v-for="page in section.pages" :key="page.id">
            <nuxt-link
              :to="page.href"
              :target="page.outbound ? '_blank' : ''"
              :class="{ selected: page.selected }"
            >
              {{ page.title }}
            </nuxt-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    sidebar: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
