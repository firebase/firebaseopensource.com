<template>
  <div class="section-card footer">
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
import { StoredProjectConfig } from '../../../../shared/types'
import { ProjectInfo } from '../../../types/app'

@Component
export default class PageFooterComponent extends Vue {
  @Prop() info!: ProjectInfo
  @Prop() projectConfig!: StoredProjectConfig

  get lastFetchedFromNow () {
    // TODO: Use -> this.projectConfig.last_fetched.toDate()
    const lastFetched = new Date(this.projectConfig.last_updated!)
    return formatDistanceToNow(lastFetched)
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 10px;
  > .content {
    padding-top: 24px;
    text-align: center;
    color: #aaa;
    font-size: 0.8em;
  }
}
</style>
