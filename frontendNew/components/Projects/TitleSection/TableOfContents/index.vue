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

<script>
export default {
  props: {
    sections: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
