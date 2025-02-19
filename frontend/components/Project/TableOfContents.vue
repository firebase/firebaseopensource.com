<template>
  <div class="dropdown">
    <span>Contents</span>
    <NuxtLink
      v-for="section in sections"
      :key="section.id"
      :to="section.ref"
      class="ellipsize"
    >
      {{ section.name }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
  const { sections } = defineProps({ sections: { required: true, type: Array }});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.dropdown {
  margin-top: 8px;
  a,
  span {
    font-size: 13px;
    line-height: 22px;
    border-left: 4px solid $blue;
    padding-left: 10px;
    clear: both;
    display: block;
  }

  span {
    color: #757575;
    font-weight: bold;
  }

  a {
    color: #212121;
    width: 100%;
    text-decoration: none;

    &:hover {
      color: $blue;
      cursor: pointer;
    }
  }
}

.dropdown a.selected {
  font-weight: bold;
}

.ellipsize {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
