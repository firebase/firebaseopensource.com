import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";
import { distanceInWordsToNow } from "date-fns";

import { FirebaseSingleton } from "../../services/firebaseSingleton";

import HeaderBar from "../../components/HeaderBar";
import FourOhFour from "../../components/FourOhFour";

import { Config } from "../../types/config";
import { Route } from "vue-router";

const Clipboard = require("clipboard");

type Section = {
  content?: String;
  name?: String;
  id?: String;
  ref?: String;
};

declare const hljs: any;

@Component({
  components: { HeaderBar, FourOhFour }
})
export default class Projects extends Vue {
  name = "projects";
  $route: Route;

  @Prop()
  sections: Section[];
  @Prop()
  header: Section;
  @Prop()
  config: Config;
  @Prop()
  is_subpage: Boolean;
  @Prop()
  dropdown_selection: String;
  @Prop()
  not_found: Boolean;
  @Prop()
  found: Boolean;
  @Prop()
  subheader_tabs: any[];

  cancels: Function[];
  show_clone_cmd: Boolean = false;

  static async load(org: string, repo: string, page: string) {
    console.log(`load(${org}, ${repo}, ${page})`);
    const result = {
      sections: []
    } as any;

    const fbt = await FirebaseSingleton.GetInstance();

    const blocked_sections = ["table of contents"];

    const id = [org, repo].join("::");

    result.subheader_tabs = [
      {
        text: "Guides",
        link: "#"
      },
      {
        text: "Github",
        link: `https://github.com/${org}/${repo}`,
        icon: 'open_in_new'
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
      result.is_subpage = true;
    } else {
      result.is_subpage = false;
      dataDoc = repoDoc;
    }

    const snapshot = await dataDoc.get();
    if (!snapshot.exists) {
      result.not_found = true;
    } else {
      result.not_found = false;
    }
    const data = snapshot.data();

    result.header = data.header as Section;
    result.page_title = data.header.name;
    const sections = snapshot.data().sections as Section[];

    sections.forEach(section => {
      if (blocked_sections.indexOf(section.name.toLowerCase()) != -1) return;
      section.id = this.as_id(section.name);
      section.ref = "#" + section.id;
      result.sections.push(section);
    });

    const configSnapshot = await fbt.fs
      .collection("configs")
      .doc(id)
      .get();

    result.config = configSnapshot.data() as Config;

    result.config.last_updated_from_now = distanceInWordsToNow(
      new Date(result.config.last_updated)
    ).replace("about", "");
    result.config.last_fetched_from_now = distanceInWordsToNow(
      result.config.last_fetched.toDate()
    );
    result.config.repo = repo;
    result.config.org = org;

    if (configSnapshot.exists && !result.not_found) {
      result.found = true;
    }

    return result;
  }

  destroyed() {
    this.cancels.forEach(c => c());
  }

  static as_id(text: String) {
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
  mounted() {
    // Make the URL always end in a slash, when appropriate.
    // Without this, relative links may break.
    try {
      if (document.location.pathname.split("/").length == 4) {
        document.location.pathname += "/";
      }
    } catch (err) {
      console.log("Cannot fix URL");
    }

    document.querySelectorAll("pre code").forEach(function(el) {
      hljs.highlightBlock(el);
    });

    new Clipboard(".copy-btn");
  }
}
