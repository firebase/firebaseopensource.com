<template>
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
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { pickLogoLetter } from '../../../../../assets/utils'
import { ProjectConfig } from '../../../../../../shared/types'

@Component
export default class LogoCircleComponent extends Vue {
    @Prop() project!: ProjectConfig
    @Prop() projectIndex!: number
    @Prop() categoryIndex!: number

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
}
</script>

<style lang="scss" scoped>
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
</style>
