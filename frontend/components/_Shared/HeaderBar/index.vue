<template>
  <div id="header-bar">
    <div v-for="header in headers" :key="header.id" class="header-clone" :class="header">
      <header class="content_grid">
        <div class="col_gutter" />
        <div class="content col_main">
          <div class="title">
            <nuxt-link to="/" class="logo">
              <img :src="require('@/assets/img/oss-logo-small.png')">
            </nuxt-link>
          </div>

          <!-- Need to render this client-side only or Nuxt gets mad -->
          <div class="search">
            <client-only>
              <span class="search-input">
                <i class="material-icons">search</i>
                <input class="algolia" type="text" placeholder="Find a project">
              </span>
            </client-only>
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

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class HeaderBarComponent extends Vue {
    @Prop() subheaderTitle: String
    @Prop() enableSubheader: Boolean
    @Prop() subheaderTabs: any[]
    @Prop() subheaderTabSelection: String

    searchExpanded = false;

    headers = [{ id: 0 }, { id: 1, spacer: true }]

    mounted () {
      const docsearch = (window as any).docsearch
      if (docsearch) {
        this.waitForSelector('.algolia').then(() => {
          docsearch({
            apiKey: '1f64b5546043241736496d3b1e0980a6',
            indexName: 'firebaseopensource',
            inputSelector: '.algolia',
            debug: false
          })
        })
      } else {
        console.warn('Could not initialize docsearch')
      }
    }

    private async waitForSelector (selector: string): Promise<void> {
      while (document.querySelectorAll(selector).length === 0) {
        // eslint-disable-next-line
        await new Promise((resolve, reject) => this.$nextTick(resolve))
      }
    }
}

</script>

<style lang="scss" scoped>
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

      @media (max-width: $phone) {
        grid-template-columns: fit-content(100%) 1fr;
      }
    }

    .search {
      display: inline-flex;
      align-items: center;

      margin-left: 16px;

      .search-input {
        display: flex;
        align-items: center;
        border: 1px solid rgba(0,0,0,0.075);
        border-radius: 9999px;

        padding-top: 2px;
        padding-bottom: 2px;
        padding-right: 4px;
        padding-left: 4px;

        background: rgba(0,0,0,0.025);

        transition: border 0.2s ease-out;
        transition: box-shadow 0.2s ease-out;
      }

      .search-input:focus-within {
        border: 1px solid #039be5;
        box-shadow: 0px 0px 4px 1px rgba(3,155,229,0.37);

        i {
          color: #039be5;
        }
      }

      i {
        font-size: 1.2rem;
        margin-top: 1px;
        margin-left: 2px;
        margin-right: 2px;
      }

      input {
        appearance: none;
        outline: none;
        border: none;
        background: none;
        font-size: .9rem;
        line-height: 1.5rem;
      }
    }

    .title {
      a.logo {
        display: block;
        overflow: hidden;
      }
      img {
        margin-top: 4px;
        height: $header-height - 8px;

        @media (max-width: $phone) {
          content:url('../../../assets/img/oss-logo-icon-only.png')
        }
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
