<template>
  <div class="project">
    <div class="grid">
      <div class="logo-circle" :style="{backgroundColor: color}">
        <!--
        TODO: Need to find an SVG letter font free for commercial use
        ex: https://www.behance.net/gallery/48597451/Free-SVG-Alphabet
                    -->
        <!-- <img
        class="logo-letter"
        v-bind:src="`/src/assets/letters/${project.letter}.svg`"> -->
        <div>{{ singleLetter }}</div>
      </div>
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Util } from '../../../../../shared/util'
import { pickLogoLetter } from '../../../../assets/utils'

@Component
export default class ProjectItemComponent extends Vue {
    @Prop() project! : any // TODO: Typings
    @Prop() projectIndex! : number
    @Prop() categoryIndex! : number

    logoCircleColors = [
      '#039BE5',
      '#673AB7',
      '#FBC02D',
      '#FF7043',
      '#C2185B',
      '#009688',
      '#9C27B0',
      '#33AC71'
    ]

    get singleLetter () {
      return pickLogoLetter(this.project.name)
    }

    get color () {
      const colors = this.logoCircleColors
      return colors[(this.projectIndex + this.categoryIndex) % colors.length]
    }

    get description () {
      const words = this.project.description.split(' ')
      let sentence = words.slice(0, 10).join(' ')
      if (words.length > 10) {
        sentence += '...'
      }
      return sentence
    }

    get parsedIdObj () {
      return Util.parseProjectId(this.project.id)
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
@import '@/assets/styles/base.scss';

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

.logo-circle {
  grid-area: logo;

  align-self: center;

  width: 50px;
  height: 50px;
  font-size: 25px;
  line-height: 50px;
  float: left;

  margin-right: 4px;
  margin-left: 0px;

  border-radius: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  color: white;

  img {
    width: 74px;
    height: 74px;
    margin: 13px;
  }
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
