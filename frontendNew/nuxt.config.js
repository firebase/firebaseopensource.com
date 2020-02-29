export default () => {
  return {
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
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: ['@/assets/styles/base.scss'],
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
      '@nuxtjs/pwa'
      // [
      //   '@nuxtjs/sitemap',
      //   {
      //     path: '/sitemap.xml',
      //     hostname: 'https://firebaseopensource.com',
      //     cacheTime: 1000 * 60 * 60 * 24,
      //     generate: true,
      //     routes: routes
      //   }
      // ]
      // [
      //   '@nuxtjs/firebase',
      //   {
      //     config: {
      //       apiKey: 'AIzaSyDFjAR2cS_QCghJ_HtKdZK06VpcqxDBt9g',
      //       databaseURL: 'https://fir-oss.firebaseio.com',
      //       storageBucket: 'fir-oss.appspot.com',
      //       authDomain: 'fir-oss.firebaseapp.com',
      //       messagingSenderId: '895878195922',
      //       projectId: 'fir-oss',
      //       appId: 'noidea' //TODO
      //     },
      //     services: {
      //       firestore: true
      //     }
      //   }
      // ]
    ],
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
