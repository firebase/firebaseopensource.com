<template>
  <div id="four-oh-four">
    <HeaderBar />
    <div class="content">
      <h1>{{ error?.statusCode || 404 }}</h1>
      <h2>{{ error?.message || "Page not found." }}</h2>
      <img src="~/assets/img/guy-fireats.png">
      <NuxtLink to="/">
        <div class="footer">
          Go to Homepage
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps({
  error: Object as () => NuxtError,
})

console.error(error)
</script>
