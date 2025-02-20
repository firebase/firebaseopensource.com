import getRoutes from './getRoutes'

export default async () => {
  const routes = await getRoutes()
  return defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },

    generate: {
      routes,
    },

    css: [
      '~/assets/styles/global.scss',
    ],

    experimental: {
      treeshakeClientOnly: true,
      payloadExtraction: true,
      sharedPrerenderData: true,
      typedPages: true,
    },

    app: {
      head: {
        title: 'Firebase Open Source',
        link: [{
          rel: 'stylesheet',
          href: '//fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;1,700&family=Roboto+Mono:ital,wght@0,400;&display=swap',
        }, {
          rel: 'stylesheet',
          href: '//fonts.googleapis.com/css2?family=Material+Icons&display=block',
        }, {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        }, {
          rel: 'shortcut icon',
          href: 'https://www.gstatic.com/devrel-devsite/prod/v38a693baeb774512feb42f10aac8f755d8791ed41119b5be7a531f8e16f8279f/firebase/images/favicon.png',
        }, {
          rel: 'apple-touch-icon',
          href: 'https://www.gstatic.com/devrel-devsite/prod/v38a693baeb774512feb42f10aac8f755d8791ed41119b5be7a531f8e16f8279f/firebase/images/touchicon-180.png',
        }, {
          rel: 'preconnect',
          href: 'https://www.google-analytics.com',
        }, {
          rel: 'preconnect',
          href: 'http://fonts.gstatic.com',
        }],
        script: [{
          src: 'https://www.googletagmanager.com/gtag/js?id=UA-110728272-1',
          async: true,
        }, {
          innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-110728272-1');`,
        }],
        meta: [{
          charset: 'utf-8',
        }, {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        }, {
          content: 'https://firebase.google.com/images/social.png',
          name: 'image',
        }, {
          hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || '',
        }, {
          property: 'og:image',
          content: 'https://firebase.google.com/images/social.png',
        }, {
          property: 'twitter:image',
          content: 'https://firebase.google.com/images/social.png',
        }, {
          property: 'og:site_name',
          content: 'Firebase Open Source',
        }, {
          property: 'og:type',
          content: 'object',
        }, {
          property: 'og:description',
          content: 'Check out this project on firebaseopensource.com!',
        }],
      },
    },

    modules: ['@nuxtjs/sitemap', '@nuxt/eslint'],

    eslint: {
      config: {
        stylistic: true,
      },
    },

    site: {
      name: 'Firebase Open Source',
      url: 'https://firebaseopensource.com/',
    },

  })
}
