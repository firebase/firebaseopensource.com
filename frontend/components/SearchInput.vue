<template>
  <span class="algolia" />
</template>

<script setup lang="ts">
import docsearch from '@docsearch/js'
import '@docsearch/css'

onMounted(() => {
  docsearch({
    container: '.algolia',
    appId: 'BH4D9OD16A',
    apiKey: '1f64b5546043241736496d3b1e0980a6',
    indexName: 'firebaseopensource',
  })
})
</script>
