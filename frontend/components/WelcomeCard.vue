<template>
  <div
    v-if="$route.path === '/'"
    class="section-card"
  >
    <div
      id="welcome_card"
      class="content welcomeCard"
    >
      <div class="image">
        <img
          src="@/assets/img/firebase-github.png"
          width="213"
          height="160"
        >
      </div>
      <div class="body">
        <h1>Firebase ❤️ Open Source</h1>
        <span>
          The Firebase community runs on open source. Our SDKs, libraries,
          samples, and demos all live on GitHub. On
          <NuxtLink to="/">firebaseopensource.com</NuxtLink> you can discover all of the
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

  <style lang="scss" scoped>
  @use '@/assets/styles/variables.scss' as *;

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
