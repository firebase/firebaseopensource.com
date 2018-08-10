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

@Component({
  components: { HeaderBar }
})
export default class Homepage extends Vue {
  name = "homepage";

  subheader_tabs: any[] = [
    { text: "All", link: "/" },
    { text: "iOS", link: "/platform/ios" },
    { text: "Android", link: "/platform/android" },
    { text: "Web", link: "/platform/web" },
    { text: "Games", link: "/platform/games" }
  ];

  fbt: FirebaseSingleton;
  cancels: Function[] = [];

  @Prop() platform: string;
  @Prop() categories: Category[];

  static getCategories() : Category[] {
    return [
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
  }

  static async load() {
      const fbt = await FirebaseSingleton.GetInstance();
      const categories = this.getCategories();
      // TODO use
      const cancels = [] as any[];
      await Promise.all(categories.map((category, categoryIndex) => {
          return new Promise((resolve, reject) => {
              cancels.push(
                  fbt.fs
                      .collection("configs")
                      .where("blacklist", "==", false)
                      .where("fork", "==", false)
                      .orderBy(`platforms.${category.platform}`)
                      .orderBy("stars", "desc")
                      .orderBy("description")
                      .onSnapshot((snapshot: any) => {
                          snapshot.docs.forEach((doc: any, docIndex: any) => {
                              const config = doc.data() as Config;
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

      return {
        categories
      };
  }

  async mounted() {
    try {
        document.querySelector("title").innerText = "Firebase Opensource";
    } catch (err) {
      console.warn("Cannot set page title.")
    }

    if (this.platform) {
      (this.$refs.header as HeaderBar).subheader_tab_selection = this.platform;
    }
  }

  destroyed() {
    this.cancels.forEach(c => c());
  }

  isSectionVisible(section: string) {
    if (!this.platform || this.platform === "all") {
      return true;
    }

    return section === this.platform;
  }
}
