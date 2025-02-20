<template>
  <div
    class="logo-circle"
  >
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

<script setup lang="ts">
const {
  project,
  projectIndex,
  categoryIndex,
} = defineProps<{
  project: ProjectConfig
  projectIndex: number
  categoryIndex: number
}>()

const colors = [
  '#039BE5',
  '#673AB7',
  '#FBC02D',
  '#FF7043',
  '#C2185B',
  '#009688',
  '#9C27B0',
  '#33AC71',
]

const singleLetter = pickLogoLetter(project.name)
const backgroundColor = ref(colors[(projectIndex + categoryIndex) % colors.length])
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
        background-color: v-bind(backgroundColor);

        img {
        width: 74px;
        height: 74px;
        margin: 13px;
        }
    }
  </style>
