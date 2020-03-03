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

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { formatDistanceToNow } from 'date-fns'
import { ProjectConfig } from '../../../../../shared/types'
import { ProjectInfo } from '../../../../types/app'

@Component
export default class RepoButtonsComponent extends Vue {
  @Prop() info! : ProjectInfo
  @Prop() projectConfig! : ProjectConfig

  showCloneCmd = false // Todo: Needed?

  get lastUpdatedFromNow () {
    // For some reason lastUpdated is not a timestamp but a datestring
    return formatDistanceToNow(new Date(this.projectConfig.last_updated))
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

  .badge {
    border-radius: 3px;
    overflow: hidden;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    font-size: 0.9em;
    text-align: center;
    padding: 5px 16px 0px 16px;
    font-weight: bold;

    background-color: $blue;
    color: white;
    * {
      height: 30px;
    }
    .key {
      display: inline;
      margin-right: 2px;

      .material-icons {
        font-size: 18px;
        position: relative;
        top: 4px;
        width: 18px;
      }
    }
    .value {
      display: inline;
    }

    transition: box-shadow 0.2s;
  }

  .badge:hover {
    box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.25);
  }

  .badge-action {
    color: lighten($blue, 10%);
    background-color: white;

    // Action buttons are not relevant on a phone
    @media (max-width: $phone) {
      display: none;
    }
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
