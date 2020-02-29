import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _14deb199 = () => interopDefault(import('../pages/platform/_platform/index.vue' /* webpackChunkName: "pages/platform/_platform/index" */))
const _6c22baef = () => interopDefault(import('../pages/projects/_org/_repo/index.vue' /* webpackChunkName: "pages/projects/_org/_repo/index" */))
const _73b704a2 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/platform/:platform?",
    component: _14deb199,
    name: "platform-platform"
  }, {
    path: "/projects/:org?/:repo?",
    component: _6c22baef,
    name: "projects-org-repo"
  }, {
    path: "/",
    component: _73b704a2,
    name: "index"
  }, {
    path: "/projects/:org/:repo/:page(.+)",
    component: _6c22baef
  }, {
    path: "/projects-staging/:org/:repo/",
    component: _6c22baef
  }, {
    path: "/projects-staging/:org/:repo/:page(.+)",
    component: _6c22baef
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
