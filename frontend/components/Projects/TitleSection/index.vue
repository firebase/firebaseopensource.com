<template>
  <div class="section title-section">
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

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-if="header.content" class="header_content" v-html="header.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableOfContents from './TableOfContents'
import RepoButtons from './RepoButtons'

export default {
  components: {
    TableOfContents,
    RepoButtons
  },
  props: {
    sections: {
      type: Array,
      required: true
    },
    projectConfig: {
      type: Object,
      required: true
    },
    projectContent: {
      type: Object,
      required: true
    },
    info: {
      type: Object,
      required: true
    },
    pageTitle: {
      type: String,
      required: true
    },
    subpageId: {
      type: String,
      default: null
    }
  },
  computed: {
    isSubpage () {
      return this.subpageId != null
    },
    relatedRepos () {
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
    },
    header () {
      return this.projectContent.header
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.section {
    margin: 30px auto 0;
    width: 100%;

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
}
</style>