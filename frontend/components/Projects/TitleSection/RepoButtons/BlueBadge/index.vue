<template>
  <a :href="badge.href" target="_blank">
    <div class="badge" :class="badge.classes">
      <div class="key">
        <i class="material-icons">{{ badge.icon }}</i>
      </div>
      <div class="value">{{ badge.value }}</div>
    </div>
  </a>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { BlueBadge } from '../../../../../types/app'

@Component
export default class RepoButtonsComponent extends Vue {
  @Prop() badge! : BlueBadge
}

</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.badge {
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 0.9em;
  text-align: center;
  padding: 5px 16px 0px 16px;
  font-weight: bold;

  background-color: $blue;
  color: white;
  * {
    height: 30px;
  }
  .key {
    display: inline;
    margin-right: 2px;

    .material-icons {
      font-size: 18px;
      position: relative;
      top: 4px;
      width: 18px;
    }
  }
  .value {
    display: inline;
  }

  transition: box-shadow 0.2s;
}

.badge:hover {
  box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.25);
}

.badge-action {
  color: lighten($blue, 10%);
  background-color: white;

  // Action buttons are not relevant on a phone
  @media (max-width: $phone) {
    display: none;
  }
}
</style>
