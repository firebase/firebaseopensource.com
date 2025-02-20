<template>
  <div class="badges">
    <ProjectButtonsBadge
      v-for="badge in badges"
      :key="badge.icon"
      :badge="badge"
    />
    <div
      v-if="showCloneCmd"
      class="copy-code-container"
    >
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

<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'

const {
  info,
  projectConfig,
} = defineProps<{
  info: ProjectInfo,
  projectConfig: ProjectConfig,
}>()

const showCloneCmd = false // TODO: Needed?
const badges = [
  {
    href: `https://github.com/${info.org}/${info.repo}/stargazers`,
    icon: 'star',
    value: info.stars.toString(),
    classes: '',
  },
  {
    href: `https://github.com/${info.org}/${info.repo}/commits/master`,
    icon: 'access_time',
    value: `${formatDistanceToNow(projectConfig.last_updated)} ago`,
    classes: '',
  },
  {
    href: `https://github.com/${info.org}/${info.repo}/`,
    icon: 'code',
    value: 'View Source',
    classes: 'badge-action',
  },
  {
    href: `https://github.com/${info.org}/${info.repo}/issues`,
    icon: 'bug_report',
    value: 'File Bug',
    classes: 'badge-action',
  },
]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

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
