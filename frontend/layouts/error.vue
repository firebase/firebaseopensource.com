<template>
  <div id="four-oh-four">
    <HeaderBar />
    <div class="content">
      <h1>404</h1>
      <h2>{{ error.message }}</h2>
      <img :src="require('@/assets/img/guy-fireats.png')">
      <nuxt-link to="/">
        <div class="footer">
          Go to Homepage
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { NuxtError } from '@nuxt/types'
import HeaderBar from '@/components/_Shared/HeaderBar/index.vue'

@Component({
  components: { HeaderBar },
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
export default class ErrorLayout extends Vue {
  @Prop()
  error: NuxtError
}
</script>

<style lang="scss" scoped>
#four-oh-four {
  width: 100%;
  text-align: center;

  h1 {
    font-size: 100px;
    padding-top: 70px;
    padding-bottom: 30px;
    opacity: 0.6;
  }

  h2 {
    font-size: 25px;
    opacity: 0.4;
    padding-bottom: 0px;
  }

  .content {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
    background-color: white;
    border-radius: 3px;
    padding: 20px 20px 20px 20px;
    max-width: 400px;
    margin: 0 auto;
    margin-top: 30px;
  }

  img {
    max-width: 100%;
    padding: 40px;
  }

  .footer {
    background-color: #eee;
    width: 100%;
    height: 20px;
    padding: 20px;
    line-height: 5px;
  }
}
</style>
