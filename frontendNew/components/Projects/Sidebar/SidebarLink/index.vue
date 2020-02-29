<template>
  <nuxt-link
    :to="link"
    :target="page.outbound ? '_blank' : ''"
    exact-active-class="selected"
  >
    {{ page.title }}
  </nuxt-link>
</template>

<script>
export default {
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  computed: {
    link () {
      // remove .md in the link
      return this.page.href.replace('.md', '')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
