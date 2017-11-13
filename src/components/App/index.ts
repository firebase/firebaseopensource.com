// VueJS modules
import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";

// Typings for modules imported dynamically
import FirebaseAppModule = require("firebase/app");

// Include automock for automated mocking
import "../../automock";

type Visit = {
  created_at: Date;
  confirmed_at: Date;
};

@Component
export default class App extends Vue {
  name = "app";
  msg = "Welcome to Your Vue.js App";
  required = {
    firebase: FirebaseAppModule
  };
  visits: Visit[] = [];

  async mounted() {
    await Promise.all([
      System.import("firebase"),
      System.import("isomorphic-fetch")
    ]);

    this.required.firebase = <typeof FirebaseAppModule>require("firebase/app");
    require("firebase/firestore");
    require("isomorphic-fetch");

    const config = await fetch("/__/firebase/init.json").then(response =>
      response.json()
    );

    this.required.firebase.initializeApp(config);

    this.required.firebase
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

  add_visit() {
    this.required.firebase
      .firestore()
      .collection("visits")
      .add({ created_at: new Date() });
  }
}

require("./template.html")(App);
