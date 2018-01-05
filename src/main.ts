/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Vue from "vue";
import VueRouter from "vue-router";

import Homepage from "./components/Homepage";
import Projects from "./components/Projects";
import FourOhFour from "./components/FourOhFour";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Homepage
  },
  {
    path: "/platform/:platform",
    component: Homepage
  },
  {
    path: "/projects/:organization/:repository/",
    component: Projects
  },
  {
    path: "/projects/:organization/:repository/:page(.+)",
    component: Projects
  },
  {
    path: "/404",
    component: FourOhFour
  },
  { path: "*", redirect: "404" }
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
