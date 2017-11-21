import Vue from "vue";
import VueRouter from "vue-router";

import Homepage from "./components/Homepage";
import Projects from "./components/Projects";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Homepage
  },
  {
    path: "/projects/:organization/:repository/",
    component: Projects
  },
  // {
  //   path: "/projects/:organization/:repository",
  //   redirect: "/projects/:organization/:repository/"
  // },
  {
    path: "/projects/:organization/:repository/:page(.+)",
    component: Projects
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

new Vue({
  el: "#app",
  router,
  template: "<router-view></router-view>"
});
