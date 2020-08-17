import firebaseConfig from '../shared/firebaseConfig'
import getRoutes from './assets/getRoutes'

export default async () => {
  const routes = await getRoutes()
  return {
    // https://nuxtjs.org/blog/going-full-static
    target: 'static',
    mode: 'universal',
    /*
     ** Headers of the page
     */
    head: {
      title: process.env.npm_package_name || '',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || ''
        }
      ],
      script: [
        { type: "text/javascript", src: "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js" }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css' }
      ]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#039be5' },

    /*
     ** Global CSS
     */
    css: ['~/assets/styles/global.scss'],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: ['~/plugins/firebaseInit'],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: ['@nuxtjs/eslint-module', '@nuxt/typescript-build'],
    /*
     ** Nuxt.js modules
     */
    modules: [
      [
        '@nuxtjs/sitemap',
        {
          path: '/sitemap.xml',
          hostname: 'https://firebaseopensource.com',
          cacheTime: 1000 * 60 * 60 * 24,
          routes
        }
      ],
      [
        '@nuxtjs/firebase',
        {
          config: firebaseConfig,
          services: {
            firestore: true
          }
        }
      ]
    ],
    /*
     ** Generate Settings
     */
    generate: {
      fallback: true, // SPA Fallback for spa/non-existing pages
      routes, // routes to prerender
      exclude: []
    },
    /*
     ** Build configuration
     */
    build: {
      /*
       ** You can extend webpack config here
       */
      extend () {}
    }
  }
}
