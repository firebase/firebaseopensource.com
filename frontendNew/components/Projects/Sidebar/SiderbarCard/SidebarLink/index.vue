<template>
  <span>
    <a
      v-if="page.outbound"
      :href="link"
      target="_blank"
      exact-active-class="selected"
    >
      {{ page.title }}
      <i class="material-icons outboundIcon">open_in_new</i>
    </a>
    <nuxt-link
      v-else
      :to="link"
      :target="page.outbound ? '_blank' : ''"
      exact-active-class="selected"
    >
      {{ page.title }}
    </nuxt-link>
  </span>
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
.outboundIcon {
  font-size: 13px;
  opacity: 0.6;
  margin-left: 3px;
}
</style>
