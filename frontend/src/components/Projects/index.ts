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
import { distanceInWordsToNow } from "date-fns";
import { FirebaseSingleton } from "../../services/firebaseSingleton";

import HeaderBar from "../HeaderBar";
import FourOhFour from "../FourOhFour";

import { Config } from "../../types/config";
import {Route} from "vue-router";

const Clipboard = require("clipboard");

type Section = {
  content?: String;
  name?: String;
  id?: String;
  ref?: String;
};

declare const hljs: any;

let template = "";
if (process.env.RENDER == "ssr") {
    template = require("fs").readFileSync(__dirname + "/template.html").toString();
}

@Component({
  components: { HeaderBar, FourOhFour },
  template
})
export default class Projects extends Vue {
  name = "projects";
  sections: Section[] = [];
  header: Section = {};
  config: Config = {};
  is_subpage = false;
  dropdown_selection = "";
  not_found = false;
  found = false;
  show_clone_cmd = false;
  cancels: Function[] = [];

  subheader_tabs: any[] = [];
  $route: Route;

  @Watch("$route.params", { deep: true })
  onRouteChanged(newParams: any, oldParams: any) {
    if (
      oldParams.repository == newParams.repository &&
      oldParams.organization == newParams.organization
    )
      return;

    this.config = {};
    this.sections = [];
    this.header = {};
    this.load();
  }

  async created() {
    try {
        if (document.location.pathname.split("/").length == 4) {
            document.location.pathname += "/";
        }
    } catch (err) {
      console.log("Cannot fix URL")
    }
    this.load();
  }

  async load() {
    const fbt = await FirebaseSingleton.GetInstance();

    const blocked_sections = ["table of contents"];

    // const org = this.$route.params.organization;
    // const repo = this.$route.params.repository;
    // const page = this.$route.params.page;
      const org = "firebase";
      const repo = "firebaseui-android";
      const page: any = undefined;

    const id = [
      org, repo
    ].join("::");

    this.subheader_tabs = [
      {
        text: "Guides",
        link: "#"
      },
      {
        text: "Github",
        link: `https://github.com/${org}/${repo}`
      }
    ];

    const repoDoc = fbt.fs.collection("content").doc(id);

    let dataDoc;
    if (page) {
      let page_id = page
        .split("/")
        .join("::")
        .toLowerCase();

      if (!page_id.endsWith(".md")) {
        page_id += ".md";
      }

      dataDoc = repoDoc.collection("pages").doc(page_id);
      this.is_subpage = true;
    } else {
      dataDoc = repoDoc;
    }

    const snapshot = await dataDoc.get();
    console.log(snapshot.ref.path);
    if (!snapshot.exists) {
      this.not_found = true;
    }
    const data = snapshot.data();

    this.header = data.header as Section;
    this.page_title = data.header.name;
    const sections = snapshot.data().sections as Section[];

    sections.forEach(section => {
      if (blocked_sections.indexOf(section.name.toLowerCase()) != -1) return;
      section.id = this.as_id(section.name);
      section.ref = "#" + section.id;
      this.sections.push(section);
    });

    const configSnapshot = await fbt.fs
      .collection("configs")
      .doc(id)
      .get();

    this.config = configSnapshot.data() as Config;
    this.config.last_updated_from_now = distanceInWordsToNow(
        new Date(this.config.last_updated)
    ).replace("about", "");
    this.config.last_fetched_from_now = distanceInWordsToNow(
        this.config.last_fetched.toDate()
    );
    this.config.repo = repo;
    this.config.org = org;

    if (configSnapshot.exists && !this.not_found) {
        this.found = true;
    }
  }

  destroyed() {
    this.cancels.forEach(c => c());
  }

  as_id(text: String) {
    return text.toLowerCase().replace(" ", "_");
  }

  set page_title(page_title: string) {
    try {
        document.querySelector("title").innerText = page_title;
    } catch (err) {
      console.warn("Cannot set page title");
    }
  }

  get page_title() {
    return this.page_title;
  }

  updated() {
    document.querySelectorAll("pre code").forEach(function(el) {
      hljs.highlightBlock(el);
    });

    new Clipboard(".copy-btn");
  }
}

if (process.env.RENDER !== "ssr") {
    require("./template.html")(HeaderBar);
}
