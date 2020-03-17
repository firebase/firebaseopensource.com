import { ComponentOptions } from 'vue'
import { Context } from '@nuxt/types'
import { MetaInfo } from 'vue-meta'

/** This fixes `No overload matches this call.` type erros on @Component decorators */
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
      asyncData?: ((ctx: Context) => void | object | Promise<void | object>),
      head?: MetaInfo | (() => MetaInfo)
    }

  }
