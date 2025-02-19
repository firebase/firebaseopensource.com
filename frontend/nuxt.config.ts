import getRoutes from "./getRoutes";

export default async () => {
  const routes = await getRoutes()
  return defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },

    generate: {
      routes,
    },

    css: [
      "~/assets/styles/global.scss",
    ],

    app: {
      head: {
        title: process.env.npm_package_name || 'Firebase Open Source',
        link: [{
          rel: "stylesheet",
          href: "//fonts.googleapis.com/css?family=Roboto:300,400,400italic,500,500italic,700,700italic|Roboto+Mono:400,500,700|Material+Icons&display=swap",
        }, {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        }, {
          rel: "preconnect",
          href: "https://www.google-analytics.com",
        }, {
          rel: "preconnect",
          href: "https://img.shields.io",
        }, {
          rel: "preconnect",
          href: "https://firestore.googleapis.com",
        }, {
          rel: "preconnect",
          href: "http://fonts.gstatic.com",
        }],
        script: [{
          src: "https://www.googletagmanager.com/gtag/js?id=UA-110728272-1",
          async: true,
        }, {
          innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-110728272-1');`
        }],
        meta: [{
          charset: 'utf-8',
        }, {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        }, {
          hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || ''
        }, {
          property: 'og:image',
          content: 'https://firebaseopensource.com/logo-small.png'
        }, {
          property: 'og:site_name',
          content: 'Firebase Open Source'
        }, {
          property: 'og:type',
          content: 'object'
        }, {
          property: 'og:description',
          content: 'Check out this project on firebaseopensource.com!'
        }]
      },
    },

    modules: ['@nuxtjs/sitemap', '@nuxt/eslint'],

    eslint: {
      config: {
        stylistic: true
      }
    },

    site: {
      name: 'Firebase Open Source',
      url: 'https://firebaseopensource.com/'
    },

  });
};