<template>
  <div class="warning">
    You are viewing this page in the STAGING environment.
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class StagingWarningComponent extends Vue {
}
</script>

<style lang="scss" scoped>
.warning {
  background: #ff8a65;
  text-align: center;
  color: white;
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
