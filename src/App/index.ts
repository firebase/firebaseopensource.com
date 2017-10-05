// Core VueJS modules
import * as VueDefault from "vue";
import VueField from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";

// Typings for modules imported dynamically
import FirebaseAppModule = require("firebase/app");

// Include automock for automated mocking
import "../automock";

type Visit = {
  created_at: Date;
  confirmed_at: Date;
};

@Component
export default class App extends (VueField || VueDefault) {
  name = "app";
  msg = "Welcome to Your Vue.js App";
  visits: Visit[] = [];

  async mounted() {
    await Promise.all([
      System.import("firebase"),
      System.import("isomorphic-fetch")
    ]);

    const firebase = <typeof FirebaseAppModule>require("firebase/app");
    require("firebase/firestore");
    require("isomorphic-fetch");

    const config = await fetch("/__/firebase/init.json").then(response =>
      response.json()
    );

    firebase.initializeApp(config);

    firebase
      .firestore()
      .collection("visits")
      .onSnapshot(snapshot => {
        snapshot.docChanges.forEach(change => {
          if (change.type == "added") {
            this.visits.push(change.doc.data() as Visit);
          }
        });
      });
  }
}

require("./template.html")(App);
