<template>
  <div class="grid">
    <nuxt-link :to="`/projects/${release.org}/${release.repo}/`" class="release-title">
      {{ release.repo }}
    </nuxt-link>
    <p class="release-description">
      <code>{{ release.tag_name }}</code> released
      {{ releaseTime }}.
    </p>
    <a :href="release.url" target="_blank">
      <button class="button-right">
        RELEASE NOTES
      </button>
    </a>
  </div>
</template>

<script>
import { daysAgo } from '@/assets/utils'

export default {
  props: {
    release: {
      type: Object,
      required: true
    }
  },
  computed: {
    releaseTime () {
      return daysAgo(this.release.created_at)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base.scss';
@import '@/assets/styles/variables.scss';

// Wrap text to a single line
.wrap-one-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 100%;
}

.grid {
  width: 100%;
  display: grid;
  grid-template-areas:
    'title'
    'description'
    'link';
  grid-template-rows: max-content 40px max-content;
  grid-gap: 8px;

    padding: 20px;
  }

  .release-description {
    @extend .body-text;
    @extend .wrap-one-line;

    margin: 0px;
    padding-top: 8px;
  }

  .release-title {
    @extend .orange-title;
    @extend .wrap-one-line;
  }

</style>
