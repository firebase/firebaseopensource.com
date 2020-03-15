<template>
  <div v-if="$route.path === '/'" class="section-card">
    <div id="welcome_card" class="content welcomeCard">
      <div class="image">
        <img :src="require('@/assets/img/firebase-github.png')">
      </div>
      <div class="body">
        <h1>Firebase ❤️ Open Source</h1>
        <span>
          The Firebase community runs on open source. Our SDKs, libraries,
          samples, and demos all live on GitHub. On
          <nuxt-link to="/">firebaseopensource.com</nuxt-link> you can discover all of the
          tools you need to build a great app. <br><br>
          Is there a great open source Firebase project that should be
          included here?
          <a
            target="_blank"
            href="https://github.com/firebase/firebaseopensource.com/issues/new?template=new_project.md"
          >Let us
            know!</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class WelcomeCardComponent extends Vue {
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.welcomeCard {
  display: grid;
  grid-gap: 16px;
  grid-template-columns: min-content 1fr;

// In phone layout, hide the image
  @media (max-width: $phone) {
    grid-template-columns: 100%;
    grid-gap: 0px;

    img {
      margin: 0;
      display: none;
    }

    h1 {
      padding-top: 0px;
    }
  }

  .body {
    color: #757575;
  }

  .image {
    display: flex;
    align-items: center;
  }

  img {
    margin: 16px;
    height: 160px;
  }
}
</style>
