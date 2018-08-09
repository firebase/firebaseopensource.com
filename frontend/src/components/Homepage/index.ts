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
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";
import { FirebaseSingleton } from "../../services/firebaseSingleton";

import HeaderBar from "../HeaderBar";

import { pickLogoLetter } from "../../utils";

import { Config } from "../../types/config";
import {Route} from "vue-router";

type Category = {
  title: string;
  platform: string;
  icon: string;
  projects: Config[];
  featured: Config[];
};

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


let template = "";
if (process.env.RENDER == "ssr") {
    template = require("fs").readFileSync(__dirname + "/template.html").toString();
}

@Component({
  components: { HeaderBar },
  template
})
export default class Homepage extends Vue {
  name = "homepage";

  categories: Category[] = [
    {
      title: "Android",
      icon: "android",
      platform: "android",
      projects: [],
      featured: []
    },
    {
      title: "Web",
      icon: "web",
      platform: "web",
      projects: [],
      featured: []
    },
    {
      title: "iOS",
      icon: "phone_android",
      platform: "ios",
      projects: [],
      featured: []
    },
    {
      title: "Games",
      icon: "gamepad",
      platform: "games",
      projects: [],
      featured: []
    }
  ];

  subheader_tabs: any[] = [
    { text: "All", link: "/platform/all" },
    { text: "iOS", link: "/platform/ios" },
    { text: "Android", link: "/platform/android" },
    { text: "Web", link: "/platform/web" },
    { text: "Games", link: "/platform/games" }
  ];
  fbt: FirebaseSingleton;
  cancels: Function[] = [];
  $route: Route;

  async load() {
      this.fbt = await FirebaseSingleton.GetInstance();
      await Promise.all(this.categories.map((category, categoryIndex) => {
          return new Promise((resolve, reject) => {
              this.cancels.push(
                  this.fbt.fs
                      .collection("configs")
                      .where("blacklist", "==", false)
                      .where("fork", "==", false)
                      .orderBy(`platforms.${category.platform}`)
                      .orderBy("stars", "desc")
                      .orderBy("description")
                      .onSnapshot(snapshot => {
                          snapshot.docs.forEach((doc, docIndex) => {
                              const config = doc.data() as Config;
                              // console.log(config);
                              config.letter = pickLogoLetter(config.name);
                              config.color = COLORS[(docIndex + categoryIndex) % COLORS.length];

                              const id = doc.id;
                              config.org = id.split("::")[0];
                              config.repo = id.split("::")[1];

                              const words = config.description.split(" ");
                              let sentence = words.slice(0, 10).join(" ");

                              if (words.length > 15) {
                                  sentence += "...";
                              }

                              config.description = sentence;

                              if (category.featured.length < 6) {
                                  category.featured.push(config);
                              }

                              category.projects.push(config);
                          });
                          resolve();
                      })
              );
          });
      }));

      return this.categories;
  }

  async created() {
    this.load();
    try {
        document.querySelector("title").innerText = "Firebase Opensource";
    } catch (err) {
      console.warn("Cannot set page title.")
    }

    if (this.$route && this.$route.params.platform) {
      (this.$refs
        .header as HeaderBar).subheader_tab_selection = this.$route.params.platform;
    }
  }

  destroyed() {
    this.cancels.forEach(c => c());
  }

  @Watch("$route.params.platform", { immediate: true })
  onRouteParamPlatformChange(platform: string) {
    if (!this.$refs.header) return;
    (this.$refs.header as HeaderBar).subheader_tab_selection = platform;
  }

  isSectionVisible(section: string) {
    const header = this.$refs.header as HeaderBar;

    return (
      !header ||
      header.subheader_tab_selection == "all" ||
      header.subheader_tab_selection == section
    );
  }
}

if (process.env.RENDER !== "ssr") {
    require("./template.html")(Homepage);
}