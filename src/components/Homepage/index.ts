import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";

import { pickLogoLetter } from "../../utils";

import { Config } from "../../types/config";

type Category = {
  title: string;
  platform: string;
  projects: Config[];
};

// Typings for modules imported dynamically
import FirebaseAppModule = require("firebase/app");

const COLORS = [
  "#039BE5",
  "#673AB7",
  "#FBC02D",
  "#FF7043",
  "#C2185B",
  "#009688",
  "#9C27B0",
  "#33AC71"
];

@Component
export default class Projects extends Vue {
  name = "projects";
  required = {
    firebase: FirebaseAppModule
  };

  categories: Category[] = [
    {
      title: "Android",
      platform: "android",
      projects: []
    },
    {
      title: "Web",
      platform: "android",
      projects: []
    },
    {
      title: "iOS",
      platform: "android",
      projects: []
    }
  ];

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

    this.categories.forEach(category => {
      this.required.firebase
        .firestore()
        .collection("configs")
        .orderBy(`platforms.${category.platform}`)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            const config = doc.data() as Config;
            config.letter = pickLogoLetter(config.name);
            config.color = COLORS[config.letter.charCodeAt(0) % COLORS.length];
            // config.color = "#";

            // for(let i=0; i<3; i++) {
            //   config.color += Math.floor(Math.random()*255).toString(16);
            // }

            // console.log(config.color);
            category.projects.push(config);
          });
        });
    });
  }
}

require("./template.html")(Projects);
