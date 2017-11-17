import Vue from "vue";
import VueRouter from "vue-router";
import App from "./components/App";

Vue.use(VueRouter);

const routes = [{ path: "/:id", component: App }];

const router = new VueRouter({
  mode: "history",
  routes
});

new Vue({
  el: "#app",
  router,
  template: "<router-view></router-view>"
});
