<template>
  <li class="sidebar-section">
    <div class="header" @click="expanded = !expanded">
      <span class="title">{{ section.title }}</span>
      <i v-if="expanded" class="material-icons">expand_less</i>
      <i v-else class="material-icons">expand_more</i>
    </div>

    <ul v-if="expanded" class="subsection">
      <li v-for="page in section.pages" :key="page.id">
        <SidebarLink :page="page" />
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import SidebarLink from './SidebarLink/index.vue'

@Component({
  components: { SidebarLink }
})
export default class SidebarCardComponent extends Vue {
    @Prop() section!: any // TODO

    expanded: Boolean = false

    created () {
    // Section Project shall be open at first
      if (this.section.title === 'Project') {
        this.expanded = true
      }
    }
}
</script>

<style lang="scss" scoped>
.sidebar-section.collapsed {
      .subsection {
        display: none;
      }
    }

    .sidebar-section {
      padding-top: 12px;
      padding-bottom: 12px;
      margin: 0px;
      box-sizing: border-box;
      border-bottom: 1px solid #cfd8dc;

      .header {
        user-select: none;
      }

      .header:hover {
        cursor: pointer;
      }

      .title {
        padding-left: 16px;
        font-size: 13px;
        line-height: 16px;
        color: #757575;
        font-weight: bold;
        width: 100%;
      }

      i.material-icons {
        position: relative;
        float: right;
        padding-top: 4px;
        padding-right: 12px;
        font-size: 24px;
        color: #949494;
      }
    }

        .sidebar-section:last-of-type {
      border-bottom: 0px;
    }
</style>
