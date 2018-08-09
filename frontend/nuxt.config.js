module.exports = {
  mode: "universal",
  router: {
    extendRoutes (routes, resolve) {
      routes.push(
        {
          path: "/",
          component: resolve(__dirname, "src/components/Homepage/index.vue")
        },
        {
          path: "/platform/:platform",
          component: resolve(__dirname, "src/components/Homepage/index.vue")
        },
        {
          path: "/projects/:org/:repo/:page(.+)",
          component: resolve(__dirname, "pages/projects/_org/_repo/index.vue")
        },
        // {
        //   path: "/404",
        //   component: FourOhFour
        // },
      )
    }
  },
  generate: {
    routes: [
      '/projects/firebase/firebaseui-android/'
    ]
  },
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: '//fonts.googleapis.com/css?family=Roboto:300,400,400italic,500,500italic,700,700italic|Roboto+Mono:400,500,700|Material+Icons'
      },
      {
        rel: 'icon',
        href: '/dist/logo-small.png'
      },
      {
        rel: 'stylesheet',
        href: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css'
      }
    ],
    script: [
      {
        src: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'
      }
    ]
  },
  modules: [
    '~/modules/typescript.js'
  ]
}
