<template>
  <div id="header-bar">
    <div v-for="header in headers" :key="header.id" class="header-clone" :class="header">
      <header class="content_grid">
        <div class="col_gutter" />
        <div class="content col_main">
          <div class="title">
            <nuxt-link to="/" class="logo">
              <img src="/oss-logo-small.png">
            </nuxt-link>
            <!-- <router-link to="/" class="text">Open Source</router-link> -->
          </div>

          <div class="link">
            <a href="https://firebase.google.com/docs/">
              <div class="icon_button">
                <div>Docs </div>
                <i class="material-icons">open_in_new</i>
              </div>
            </a>
          </div>
        </div>
        <div class="col_gutter" />
      </header>
      <div v-if="enableSubheader" class="subheader content_grid">
        <div class="col_gutter" />
        <div class="content col_main">
          <h2 v-if="subheaderTitle">
            {{ subheaderTitle }}
          </h2>
          <div class="tabs">
            <template
              v-for="tab in subheaderTabs"
            >
              <a
                v-if="tab.outbound"
                :key="tab.title"
                target="_blank"
                :href="tab.href"
                class="tab"
              >
                {{ tab.title }}
                <i class="material-icons">open_in_new</i>
              </a>
              <nuxt-link
                v-else
                :key="tab.title"
                :class="{selected: subheaderTabSelection == tab.title.toLowerCase()}"
                :target="tab.outbound ? '_blank' : ''"
                :to="tab.href"
                class="tab"
              >
                {{ tab.title }}
              </nuxt-link>
            </template>
          </div>
        </div>
        <div v-if="!subheaderTabs" class="tab-spacer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    enableSubheader: {
      type: Boolean
    },
    subheaderTitle: {
      type: String,
      default: null
    },
    subheaderTabs: {
      type: Array,
      default: null
    },
    subheaderTabSelection: {
      type: String,
      default: null
    }
  },
  data: () => ({
    headers: [{ id: 0 }, { id: 1, spacer: true }]
  })
}

</script>

<style lang="scss">
@import '@/assets/styles/variables.scss';

.header-clone {
  position: fixed;
  top: 0px;
  z-index: 3;
  width: 100%;

  &.spacer {
    position: static;
    opacity: 0;
  }

  .content {
    width: 100%;
    max-width: $max-content-width;
    margin: 0 auto;

    @media (max-width: $tablet) {
      width: 100%;
    }
  }

  header {
    padding: 4px 0px 4px 0px;
    background-color: #ffffff;
    color: #a0a0a0;
    box-shadow: 1px 0px 2px rgba(0, 0, 0, 0.8);
    width: 100%;

    .content {
      display: grid;
      grid-template-columns: 1fr fit-content(100%);
      justify-content: space-between;
      padding: 0px 20px;
    }

    .link {
      line-height: $header-height;
    }

    .title {
      a.logo {
        display: block;
        width: 250px;
        overflow: hidden;
      }
      img {
        margin-top: 4px;
        height: $header-height - 8px;
      }
    }

    a {
      color: inherit;
    }

    .icon_button {
      display: grid;
      grid-template-columns: fit-content(100%) fit-content(100%);
      align-items: center;

      i {
        margin-left: 8px;
      }

      transition: 0.4s color;
      &:hover {
        color: black;
      }
    }
  }

.subheader {
  background-color: $blue;
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.3);
  color: white;

  h2 {
    font-weight: normal;
    font-size: 20px;
    padding: 24px 0px 0px 0px;
  }

  .content {
    padding: 0px 20px;
  }

  .tab-spacer {
    height: 14px;
  }

  .tabs {
    overflow: auto;

    .tab:first-of-type {
      padding-left: 0px;
    }

    .tab {
      float: left;
      border-bottom: 3px solid $blue;
      font-weight: 500;
      font-size: 14px;
      line-height: 44px;
      opacity: 0.7;
      padding: 8px 20px 5px 20px;
      user-select: none;
      display: block;
      color: white;
      transition: opacity 0.1s linear;
      text-transform: uppercase;

      @media (max-width: $phone) {
        padding: 0px 10px;
      }

      &.selected {
        border-bottom: 3px solid white;
        opacity: 1;
      }

      &:hover {
        cursor: pointer;
        opacity: 1;
      }

      i.material-icons {
        position: relative;
        top: 1px;
        left: 4px;
        font-size: 14px;
      }
    }
  }
}

}

</style>
