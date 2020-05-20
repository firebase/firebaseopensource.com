<template>
  <span>
    <a
      v-if="page.outbound"
      :href="link"
      target="_blank"
      exact-active-class="selected"
    >
      {{ page.title }}
      <i class="material-icons outboundIcon">open_in_new</i>
    </a>
    <a
      v-else
      :href="link"
      :target="page.outbound ? '_blank' : ''"
      exact-active-class="selected"
    >
      {{ page.title }}
    </a>
  </span>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { SelectableLink } from '../../../../../assets/classes'

@Component
export default class SidebarLinkComponent extends Vue {
  @Prop() page! : SelectableLink

  get link () {
    // remove .md in the link
    return this.page.href.replace('.md', '')
  }
}
</script>

<style lang="scss" scoped>
.outboundIcon {
  font-size: 13px;
  opacity: 0.6;
  margin-left: 3px;
}

a {
  color: #212121;
}

a:hover {
  color: #039be5;
  cursor: pointer;
}

a.selected {
  color: #039be5;
  font-weight: bold;
}

</style>
