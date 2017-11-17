// VueJS modules
import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";

// Typings for modules imported dynamically
import FirebaseAppModule = require("firebase/app");

// Include automock for automated mocking
import "../../automock";

type Section = {
  content: String;
  name: String;
  id: String;
  ref: String;
};

type Config = {
  name?: String;
  content?: String;
  type?: "library";
}

declare const hljs: any;

@Component
export default class App extends Vue {
  name = "app";
  msg = "Welcome to Your Vue.js App";
  required = {
    firebase: FirebaseAppModule
  };
  sections: Section[] = [];
  config: Config = {};

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

    const blocked_sections = [
      "table of contents"
    ];

    const id = this.$route.params.id;

    this.required.firebase
      .firestore()
      .collection("content")
      .doc(id)
      .onSnapshot(snapshot => {
        const sections = snapshot.data().sections as Section[];

        sections.forEach((section) => {
          if (blocked_sections.indexOf(section.name.toLowerCase()) != -1)
            return;
          section.id = this.as_id(section.name);
          section.ref = "#" + section.id;
          this.sections.push(section);
        });
      });

    this.required.firebase
      .firestore()
      .collection("configs")
      .doc(id)
      .onSnapshot(snapshot => {
        this.config = snapshot.data() as Config;
      });
  }

  add_visit() {
    this.required.firebase
      .firestore()
      .collection("visits")
      .add({ created_at: new Date() });
  }

  as_id(text: String) {
    return text.toLowerCase().replace(' ', '_');
  }

  updated() {
    document.querySelectorAll('pre code').forEach(function(el) {
      hljs.highlightBlock(el);
    });
  }  
}

require("./template.html")(App);
