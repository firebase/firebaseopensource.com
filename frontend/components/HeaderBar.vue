<template>
  <div id="header-bar">
    <div
      v-for="header in headers"
      :key="header.id"
      class="header-clone"
      :class="header"
    >
      <header class="content_grid">
        <div class="col_gutter" />
        <div class="content col_main">
          <div class="title">
            <NuxtLink
              prefetch-on="interaction"
              to="/"
              class="logo"
            >
              <img
                src="@/assets/img/firebase-icon.svg"
                width="32"
                height="32"
              >
              <span><strong>Firebase</strong> Open Source</span>
            </NuxtLink>
          </div>

          <!-- Need to render this client-side only or Nuxt gets mad -->
          <div class="search">
            <SearchInput />
          </div>
        </div>
        <div class="col_gutter" />
      </header>
      <div
        v-if="enableSubheader"
        class="subheader content_grid"
      >
        <div class="col_gutter" />
        <div class="content col_main">
          <h2 v-if="subheaderTitle">
            {{ subheaderTitle }}
          </h2>
          <div class="tabs">
            <template
              v-for="tab in subheaderTabs"
              :key="tab.title"
            >
              <a
                v-if="tab.outbound"
                target="_blank"
                :href="tab.href"
                class="tab"
              >
                {{ tab.title }}
                <i class="material-icons">open_in_new</i>
              </a>
              <NuxtLink
                v-else
                prefetch-on="interaction"
                :class="{ selected: subheaderTabSelection == tab.title.toLowerCase() }"
                :target="tab.outbound ? '_blank' : ''"
                :to="tab.href"
                class="tab"
              >
                {{ tab.title }}
              </NuxtLink>
            </template>
          </div>
        </div>
        <div
          v-if="!subheaderTabs"
          class="tab-spacer"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  subheaderTitle,
  enableSubheader,
  subheaderTabs,
  subheaderTabSelection,
} = defineProps<{
  subheaderTitle?: string | null
  enableSubheader?: boolean | null
  subheaderTabs?: Array<HeaderTab> | Readonly<Array<HeaderTab>> | null
  subheaderTabSelection?: string | null
}>()

const headers = [{ id: 0 }, { id: 1, spacer: true }]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

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

    .search {
      display: inline-flex;
      align-items: center;
      margin-left: 16px;
    }

    .title {
      a.logo {
        display: block;
        overflow: hidden;
        margin: 12px 0 12px -12px;
        span {
          font-size: $header-height - 16px;
          color: #5e5e5e;
        }
      }
      img {
        margin: 0 4px -6px 0;
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
