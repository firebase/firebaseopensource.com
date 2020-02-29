<template>
  <div class="dropdown">
    <span>Contents</span>
    <nuxt-link
      v-for="section in sections"
      :key="section.id"
      :to="section.ref"
      :class="{
        selected: section.name === dropdownSelection,
        ellipsize: true
      }"
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
  },
  data: () => ({
    dropdownSelection: ''// TODO
  })
}
</script>

<style lang="scss" scoped>

</style>
