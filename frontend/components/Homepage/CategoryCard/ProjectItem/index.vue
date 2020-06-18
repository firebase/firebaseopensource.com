<template>
  <div class="project">
    <div class="grid">
      <LogoCircle v-bind="$props" />
      <nuxt-link :to="link" class="project-title">
        {{ project.name }}
      </nuxt-link>
      <p class="project-description">
        {{ description }}
      </p>
      <nuxt-link :to="link">
        <button class="button-right">
          LEARN MORE
        </button>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Util } from '../../../../../shared/util'
import { ProjectConfig } from '../../../../../shared/types'
import LogoCircle from './LogoCircle/index.vue'

@Component({
  components: { LogoCircle }
})
export default class ProjectItemComponent extends Vue {
    @Prop() project! : ProjectConfig
    @Prop() projectIndex! : number
    @Prop() categoryIndex! : number

    get description () {
      if (!this.project.description) {
        return ''
      }
      const words = this.project.description.split(' ')
      let sentence = words.slice(0, 10).join(' ')
      if (words.length > 10) {
        sentence += '...'
      }
      return sentence
    }

    get parsedIdObj () {
      return Util.parseProjectId(this.project.id!)
    }

    get org () {
      return this.parsedIdObj.owner
    }

    get repo () {
      return this.parsedIdObj.repo
    }

    get link () {
      return `/projects/${this.org}/${this.repo}/`
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
// Wrap text to a single line
.wrap-one-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 100%;
}

.project {
  overflow: hidden;

  border: 1px solid #eceff1;
  border-width: 0px 0px 1px 0px;
}

.grid {
  width: 100%;

  display: grid;
  grid-template-areas:
    'logo title'
    'description description'
    'link link';
  grid-template-columns: min-content auto;
  grid-template-rows: max-content 70px min-content;
  grid-gap: 8px;
  padding: 20px 10px;

  float: left;
  position: relative;
  padding: 20px;
}

.project-title {
  @extend .orange-title;
  @extend .wrap-one-line;

  grid-area: title;
  align-self: center;
}

.project-description {
  @extend .body-text;
  grid-area: description;

  margin: 0px;
  padding-top: 8px;
}

a {
  grid-area: link;
}
</style>
