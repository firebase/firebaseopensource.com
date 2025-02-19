<template>
  <div class="project">
    <div class="grid">
      <LogoCircle :project="project" :project-index="projectIndex" :category-index="categoryIndex" />
      <nuxt-link
        :to="link"
        class="project-title"
      >
        {{ project.name }}
      </nuxt-link>
      <p class="project-description">
        {{ description }}
      </p>
      <nuxt-link :to="link">
        <button class="button-right">
          LEARN MORE
        </button>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  project,
  projectIndex,
  categoryIndex,
} = defineProps({
  project: { required: true, type: Object as ProjectConfig },
  projectIndex: { required: true, type: Number },
  categoryIndex: { required: true, type: Number },
})

// TODO extract into util
const getDescription = () => {
  if (!project.description) {
    return ''
  }
  const words = project.description.split(' ')
  let sentence = words.slice(0, 10).join(' ')
  if (words.length > 10) {
    sentence += '...'
  }
  return sentence
}

const description = getDescription()

const parsedIdObj = Util.parseProjectId(project.id!)
const org = parsedIdObj.owner
const repo = parsedIdObj.repo
const link = `/projects/${org}/${repo}/`
</script>

  <style lang="scss" scoped>
  @use '@/assets/styles/global.scss';
  // Wrap text to a single line
  .wrap-one-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 100%;
  }

  .project {
    overflow: hidden;

    border: 1px solid #eceff1;
    border-width: 0px 0px 1px 0px;
  }

  .grid {
    width: 100%;

    display: grid;
    grid-template-areas:
      'logo title'
      'description description'
      'link link';
    grid-template-columns: min-content auto;
    grid-template-rows: max-content 70px min-content;
    grid-gap: 8px;
    padding: 20px 10px;

    float: left;
    position: relative;
    padding: 20px;
  }

  .project-title {
    @extend .orange-title;
    @extend .wrap-one-line;

    grid-area: title;
    align-self: center;
  }

  .project-description {
    @extend .body-text;
    grid-area: description;

    margin: 0px;
    padding-top: 8px;
  }

  a {
    grid-area: link;
  }
</style>
