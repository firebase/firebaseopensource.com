import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";
import FirebaseModule = require("firebase");

(require as any).ensure(["firebase"], () => {
  const firebase = <typeof FirebaseModule>require("firebase");
  require("firebase/firestore");

  fetch("/__/firebase/init.json")
    .then(response => response.json())
    .then(json => firebase.initializeApp(json))
    .then(() => {
      // use Firebase
    });
});

@Component
export default class App extends Vue {
  name = "app";
  msg = "Welcome to Your Vue.js App";
}

require("./template.html")(App);
