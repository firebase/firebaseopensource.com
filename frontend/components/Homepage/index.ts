// @ts-nocheck
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import { RepoRelease } from '../../../shared/types'
import ReleaseItem from './ReleaseItem'
import CategoryCard from './CategoryCard'
import WelcomeCard from './WelcomeCard'

import HeaderBar from '@/components/_Shared/HeaderBar'

@Component({
  components: { HeaderBar, ReleaseItem, CategoryCard, WelcomeCard }
})

export default class Homepage extends Vue {
  subheaderTabs: any[] = [
    { title: 'All', href: '/' },
    { title: 'iOS', href: '/platform/ios' },
    { title: 'Android', href: '/platform/android' },
    { title: 'Web', href: '/platform/web' },
    { title: 'Admin', href: '/platform/admin' },
    { title: 'Games', href: '/platform/games' }
  ]

  @Prop()
  platform: string

  @Prop()
  categories: Category[]

  @Prop()
  recentReleases: RepoRelease[]

  isSectionVisible (section: string) {
    if (!this.platform || this.platform === 'all') {
      return true
    }

    return section === this.platform
  }
}
