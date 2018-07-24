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

type Category = {
  title: string;
  platform: string;
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
export default class Projects extends Vue {
  name = "projects";

  categories: Category[] = [
    {
      title: "Android",
      platform: "android",
      projects: [],
      featured: []
    },
    {
      title: "Web",
      platform: "web",
      projects: [],
      featured: []
    },
    {
      title: "iOS",
      platform: "ios",
      projects: [],
      featured: []
    },
    {
      title: "Games",
      platform: "games",
      projects: [],
      featured: []
    }
  ];

  subheader_tabs: any[] = [
    {text: "All", link: "/platform/all"},
    {text: "iOS", link: "/platform/ios"},
    {text: "Android", link: "/platform/android"},
    {text: "Web", link: "/platform/web"},
    {text: "Games", link: "/platform/games"},
  ];
  fbt: FirebaseSingleton;
  cancels: Function[] = [];

  async created() {
    document.querySelector("title").innerText = "Firebase Opensource";

    this.fbt = await FirebaseSingleton.GetInstance();

    this.categories.forEach((category, categoryIndex) => {
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

            setTimeout(() => (window as any).renderComplete = true, 100);
          })
      );
    });

    if (this.$route.params.platform) {
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

  async preload(project: Config) {
    const id = [project.org, project.repo].join("::");

    const cancel = this.fbt.fs
      .collection("content")
      .doc(id)
      .onSnapshot(snapshot => {
        // console.log(snapshot.data())
        setTimeout(cancel, 15000);
      });
  }
}

require("./template.html")(Projects);
