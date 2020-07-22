<template>
  <div class="badges">
    <BlueBadge v-for="badge in badges" :key="badge.icon" :badge="badge" />
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

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { formatDistanceToNow } from 'date-fns'
import { ProjectConfig } from '../../../../../shared/types'
import { ProjectInfo } from '../../../../types/app'
import BlueBadge from './BlueBadge/index.vue'

@Component({
  components: {
    BlueBadge
  }
})
export default class RepoButtonsComponent extends Vue {
  @Prop() info! : ProjectInfo
  @Prop() projectConfig! : ProjectConfig

  showCloneCmd = false // TODO: Needed?
  badges = [
    {
      href: `https://github.com/${this.info.org}/${this.info.repo}/stargazers`,
      icon: 'star',
      value: this.info.stars,
      classes: ''
    },
    {
      href: `https://github.com/${this.info.org}/${this.info.repo}/commits/master`,
      icon: 'access_time',
      value: `${this.lastUpdatedFromNow} ago`,
      classes: ''
    },
    {
      href: `https://github.com/${this.info.org}/${this.info.repo}/`,
      icon: 'code',
      value: 'View Source',
      classes: 'badge-action'
    },
    {
      href: `https://github.com/${this.info.org}/${this.info.repo}/issues`,
      icon: 'bug_report',
      value: 'File Bug',
      classes: 'badge-action'
    }
  ]

  get lastUpdatedFromNow (): string {
    return formatDistanceToNow(this.projectConfig.last_updated)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.badges {
  margin-top: 16px;
  display: grid;
  grid-auto-columns: max-content;
  grid-template-areas:
    'button button'
    'button button'
    'copy copy';
  grid-gap: 6px;

  float: right;
  @media (max-width: $tablet) {
    float: left;
    margin-bottom: 8px;
  }
}

.copy-code-container {
  position: relative;
  clear: both;

  grid-area: copy;
  input {
    width: 100%;
    height: 30px;
    margin-top: 5px;

    font-family: monospace;
    padding: 3px 40px 3px 6px;
    box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    border: 1px solid #d1d5da;
  }

  button {
    height: 30px;

    position: absolute;
    right: 0px;
    bottom: 0px;

    border: 1px solid #bbb;
    background-color: #eee;

    .material-icons {
      overflow: hidden;
      line-height: 20px;
      display: block;
      font-size: 20px;
    }
  }
}

</style>
