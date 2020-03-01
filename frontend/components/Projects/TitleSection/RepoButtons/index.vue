<template>
  <div class="badges">
    <!-- TODO work with array in JS to reduce repeating template code-->
    <a :href="`https://github.com/${info.org}/${info.repo}/stargazers`" target="_blank">
      <div class="badge">
        <div class="key">
          <i class="material-icons">star</i>
        </div>
        <div class="value">{{ info.stars }}</div>
      </div>
    </a>

    <a :href="`https://github.com/${info.org}/${info.repo}/commits/master`" target="_blank">
      <div class="badge">
        <div class="key">
          <i class="material-icons">access_time</i>
        </div>
        <div class="value">{{ lastUpdatedFromNow }} ago</div>
      </div>
    </a>

    <a :href="`https://github.com/${info.org}/${info.repo}/`" target="_blank">
      <div class="badge badge-action">
        <div class="key">
          <i class="material-icons">code</i>
        </div>
        <div class="value">View Source</div>
      </div>
    </a>

    <a :href="`https://github.com/${info.org}/${info.repo}/issues`" target="_blank">
      <div class="badge badge-action">
        <div class="key">
          <i class="material-icons">bug_report</i>
        </div>
        <div class="value">File Bug</div>
      </div>
    </a>

    <div v-if="showCloneCmd" class="copy-code-container">
      <input
        id="git-clone-copy-txt"
        type="text"
        :value="`git clone git@github.com:${info.org}/${info.repo}.git`"
        readonly
      >
      <button
        id="git-clone-copy-btn"
        class="copy-btn"
        type="button"
        data-clipboard-target="#git-clone-copy-txt"
      >
        <i class="material-icons">content_copy</i>
      </button>
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
  data: () => ({
    showCloneCmd: false // Todo: Needed?
  }),
  computed: {
    lastUpdatedFromNow () {
    // For some reason lastUpdated is not a timestamp but a datestring
      return formatDistanceToNow(new Date(this.projectConfig.last_updated))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
