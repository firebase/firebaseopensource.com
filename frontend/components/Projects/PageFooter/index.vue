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

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { formatDistanceToNow } from 'date-fns'

@Component
export default class PageFooterComponent extends Vue {
  @Prop() info!:any // TODO
  @Prop() projectConfig!:any // TODO

  get lastFetchedFromNow () {
    // TODO: Use -> this.projectConfig.last_fetched.toDate()
    const lastFetched = new Date(this.projectConfig.last_updated)
    return formatDistanceToNow(lastFetched)
  }
}
</script>

<style lang="scss" scoped>

</style>
