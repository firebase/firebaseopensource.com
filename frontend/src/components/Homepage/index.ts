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
import { Component, Prop } from "vue-property-decorator";
import { FirebaseSingleton } from "../../services/firebaseSingleton";

import HeaderBar from "../HeaderBar";

import { pickLogoLetter, daysAgo } from "../../utils";

import { Util } from "../../../../shared/util";
import { RepoRelease, StoredProjectConfig } from "../../../../shared/types";

type Category = {
  title: string;
  platform: string;
  icon: string;
  projects: ProjectInfo[];
  featured: ProjectInfo[];
};

type ProjectInfo = {
  org: string;
  repo: string;

  name: string;
  description: string;

  letter: string;
  color: string;
}

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
    { title: "All", href: "/" },
    { title: "iOS", href: "/platform/ios" },
    { title: "Android", href: "/platform/android" },
    { title: "Web", href: "/platform/web" },
    { title: "Admin", href: "/platform/admin" },
    { title: "Games", href: "/platform/games" }
  ];

  fbt: FirebaseSingleton;

  @Prop()
  platform: string;

  @Prop()
  categories: Category[];

  @Prop()
  releases: RepoRelease[];

  static getCategories(): Category[] {
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
        title: "Admin",
        icon: "lock",
        platform: "admin",
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

  static async load(platform: string) {
    const fbt = await FirebaseSingleton.GetInstance();
    const categories = this.getCategories();

    let limit = 6;
    if (platform && platform !== "all") {
      limit = 100;
    }

    const releasesSnap = await fbt.fs
      .collection("releases")
      .orderBy("created_at", "desc")
      .limit(10)
      .get();

    // Want to get a total of 3 releases but make sure no repo
    // is mentioned more than once
    const releasedRepos = new Set<String>();
    const releases: RepoRelease[] = [];
    releasesSnap.docs.forEach(
      (doc: firebase.firestore.QueryDocumentSnapshot) => {
        const release = doc.data() as RepoRelease;
        if (!releasedRepos.has(release.repo) && releases.length < 3) {
          releases.push(release);
          releasedRepos.add(release.repo);
        }
      }
    );

    for (let i = 0; i < categories.length; i++) {
      const categoryIndex = i;
      const category = categories[i];

      const snapshot = await fbt.fs
        .collection("configs")
        .where("blacklist", "==", false)
        .where("fork", "==", false)
        .orderBy(`platforms.${category.platform}`)
        .orderBy("stars", "desc")
        .orderBy("description")
        .limit(limit)
        .get();

      snapshot.docs.forEach(
        (doc: firebase.firestore.QueryDocumentSnapshot, docIndex: number) => {
          const config = doc.data() as StoredProjectConfig;

          const letter = pickLogoLetter(config.name);
          const color = COLORS[(docIndex + categoryIndex) % COLORS.length];

          const parsedId = Util.parseProjectId(doc.id);
          const org = parsedId.owner;
          const repo = parsedId.repo;

          const words = config.description.split(" ");
          let sentence = words.slice(0, 10).join(" ");
          if (words.length > 10) {
            sentence += "...";
          }
          const description = sentence;

          const catProj: ProjectInfo = {
            name: config.name,
            description,
            letter,
            color,
            org,
            repo
          }

          if (category.featured.length < 6) {
            category.featured.push(catProj);
          }

          category.projects.push(catProj);
        }
      );
    }

    return {
      releases,
      categories
    };
  }

  mounted() {}

  destroyed() {}

  isSectionVisible(section: string) {
    if (!this.platform || this.platform === "all") {
      return true;
    }

    return section === this.platform;
  }

  showingAllPlatforms() {
    return this.platform === "all";
  }

  releaseTime(release: RepoRelease) {
    return daysAgo(release.created_at);
  }
}
