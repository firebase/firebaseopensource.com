import { ComponentOptions } from 'vue'
import { Context } from '@nuxt/types'
import { MetaInfo } from 'vue-meta'

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
      asyncData?: ((ctx: Context) => void | object | Promise<void | object>),
      head?: MetaInfo | (() => MetaInfo)
    }

  }
