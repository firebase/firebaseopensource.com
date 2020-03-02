<template>
  <div>
    <nuxt />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class DefaultLayout extends Vue {
  head () {
    return {
      title: 'Firebase Open Source',
      meta: [
        {
          property: 'og:image',
          content: 'https://firebaseopensource.com/logo-small.png'
        },
        {
          property: 'og:site_name',
          content: 'Firebase Open Source'
        },
        {
          property: 'og:type',
          content: 'object'
        },
        {
          property: 'og:description',
          content: 'Check out this project on firebaseopensource.com!'
        }
      ]
    }
  }
}
</script>
