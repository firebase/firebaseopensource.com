<template>
  <div class="section-card">
    <div class="content toc-grid">
      <div class="body-column">
        <div class="left">
          <h1>{{ pageTitle }}</h1>

          <div v-if="!isSubpage" class="related">
            <div class="repos">
              <nuxt-link
                v-for="repo in relatedRepos"
                :key="repo.id"
                class="repo test"
                :to="`/projects/${repo.path}`"
              >
                <i class="material-icons">link</i>
                <span>{{ repo.name }}</span>
              </nuxt-link>
            </div>
          </div>
        </div>

        <div class="right">
          <RepoButtons v-if="!isSubpage" :info="info" :project-config="projectConfig" />
        </div>

        <div>
          <TableOfContents v-if="sections.length > 1" :sections="sections" />
          <div v-if="header.content" class="header_content" v-html="header.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { ProjectConfig, PageContent } from '../../../../shared/types'
import { ProjectInfo } from '../../../types/app'
import TableOfContents from './TableOfContents/index.vue'
import RepoButtons from './RepoButtons/index.vue'

@Component({
  components: { TableOfContents, RepoButtons }
})
export default class TitleSectionComponent extends Vue {
  @Prop() sections!: []
  @Prop() projectConfig!: ProjectConfig
  @Prop() projectContent!: PageContent
  @Prop() info!: ProjectInfo
  @Prop() pageTitle!: string
  @Prop() subpageId: string

  get isSubpage () {
    return this.subpageId != null
  }

  get relatedRepos () {
    const config = this.projectConfig
    if (!config.related) {
      return []
    }

    return Object.keys(config.related).map((repo) => {
      // Format the name of a related project for display.
      // Strips the "firebase/" from the name to save space, since
      // the firebase context is implied on firebaseopensource.com
      let name = repo
      if (repo.includes('firebase/')) {
        name = repo.substring('firebase/'.length, repo.length)
      }

      return {
        name,
        path: repo
      }
    })
  }

  get header () {
    return this.projectContent.header
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.section-card {
  margin: 30px auto 0;
  width: 100%;
}

.content {
  padding: 24px 32px 24px 32px;
}

.img-badge {
  display: none;
}

h1 {
  padding: 16px 0px 0px 0px;
  margin: 0px;
  line-height: 1.1em;
}

h2 {
  font-weight: 300;
  font-size: 24px;
  line-height: 32px;
  color: #212121;
  border-bottom: 1px solid $gray;
}

h3 {
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  color: #212121;
}

h4 {
  font-weight: 400;
  font-size: 18px;
  line-height: 32px;
  color: #212121;
}

h5 {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #212121;
}

.body-column {
  display: grid;
  grid-template-columns: minmax(50%, max-content) 1fr;
  grid-template-areas:
    'left right'
    'content content';
  grid-gap: 12px;

  min-height: 80px;

  > .header_content {
    grid-area: content;

    p:last-of-type {
      margin: 0px;
    }

    &:first-of-type {
      margin-top: 0px;
    }
  }

  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'left'
      'right'
      'content';
    grid-gap: 0px;
  }
}

.header_content {
  margin-top: 20px;
}

/deep/ .header_content > h3 {
  font-weight: 400;
  line-height: 32px;
  color: #212121;
  font-size: 20px;
}

/deep/ .header_content > blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  background: white;
}

.related {
  width: 100%;
  overflow: hidden;
  margin-top: 16px;

  .title {
    margin-right: 10px;
  }
  .repo {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 100px;
    padding: 0px 14px;
    float: left;
    font-size: 0.8em;
    margin-right: 10px;
    margin-bottom: 4px;

    align-items: center;
    color: black;
    opacity: 0.5;

    .material-icons {
      margin-right: 8px;
      font-size: 1.5em;
      position: relative;
      top: 5px;
    }

    transition: 0.2s;
    &:hover {
      cursor: pointer;
      background-color: $yellow;
      color: darken($yellow, 50%);
      border: 1px solid darken($yellow, 5%);
      opacity: 1;
    }
  }
}
</style>
