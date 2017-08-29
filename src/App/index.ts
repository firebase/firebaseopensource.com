import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  name = "app";
  msg = "Welcome to Your Vue.js App";
};

require("./template.html")(App);
