<template>
  <div class="section footer">
    <div class="content">
      This page was generated approximately
      {{ lastFetchedFromNow }} ago.
      <br>For copyright and
      licensing details please see the
      <a
        :href="
          `https://github.com/${info.org}/${info.repo}/blob/master/LICENSE`
        "
      >LICENSE</a>
      file.
    </div>
  </div>
</template>

<script>
import { formatDistanceToNow } from 'date-fns'

export default {
  props: {
    info: {
      type: Object,
      required: true
    },
    projectConfig: {
      type: Object,
      required: true
    }
  },
  computed: {
    lastFetchedFromNow () {
    // TODO: Use -> this.projectConfig.last_fetched.toDate()
      const lastFetched = new Date(this.projectConfig.last_updated)
      return formatDistanceToNow(lastFetched)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
