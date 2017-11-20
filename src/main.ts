import Vue from "vue";
import VueRouter from "vue-router";
import App from "./components/App";

Vue.use(VueRouter);

const routes = [
  {
    path: "/projects/:organization/:repository",
    component: App
  },
  {
    path: "/projects/:organization/:repository/:page(.+)",
    component: App
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
