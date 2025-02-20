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

<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'

const {
  info,
  projectConfig,
} = defineProps<{
  info: ProjectInfo,
  projectConfig: ProjectConfig,
}>()
const lastFetchedFromNow = formatDistanceToNow(projectConfig.last_fetched)
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
