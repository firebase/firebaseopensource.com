<template>
  <div>
    <nuxt />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  // @ts-ignore - vscode complains "no overload matches this call" for some reason...
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
})
export default class DefaultLayout extends Vue {

}
</script>
