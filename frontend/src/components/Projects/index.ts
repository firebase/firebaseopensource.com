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

class SidebarSection {
  title: String = "";
  expanded: Boolean = false;
  pages: SelectableLink[] = [];

  constructor(title: String, pages: SelectableLink[], expanded = false) {
    this.title = title;
    this.pages = pages;
    this.expanded = expanded;
  }
}

class SelectableLink {
  title: String = "";
  href: String = "";
  selected: Boolean = false;

  constructor(title: String, href: String, selected = false) {
    this.title = title;
    this.href = href;
    this.selected = selected;
  }
}

declare const hljs: any;

@Component({
  components: { HeaderBar, FourOhFour }
})
export default class Projects extends Vue {
  name = "projects";
  $route: Route;

  @Prop()
  page_title: String;
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
  @Prop()
  sidebar: SidebarSection[];

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
        icon: "open_in_new"
      }
    ];

    const repoDoc = fbt.fs.collection("content").doc(id);
    const configDoc = fbt.fs.collection("configs").doc(id);

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

    // Load conetnt
    const snapshot = await dataDoc.get();
    if (!snapshot.exists) {
      result.not_found = true;
    } else {
      result.not_found = false;
    }
    const data = snapshot.data();

    // Load config
    const configSnap = await configDoc.get();
    if (configSnap.exists && !result.not_found) {
      result.found = true;
    }
    result.config = configSnap.data() as Config;

    // Choose the page name depending on available info:
    // Option 0 - title of the header section
    // Option 1 - the name from the config.
    // Option 2 - the repo name
    if (data.header.name) {
      result.page_title = data.header.name;
    } else if (result.config.name) {
      result.page_title = result.config.name;
    } else {
      result.page_title = repo;
    }

    const sections = snapshot.data().sections as Section[];
    result.header = data.header as Section;

    sections.forEach(section => {
      if (blocked_sections.indexOf(section.name.toLowerCase()) != -1) return;
      section.id = this.as_id(section.name);
      section.ref = "#" + section.id;
      result.sections.push(section);
    });

    result.config.last_updated_from_now = distanceInWordsToNow(
      new Date(result.config.last_updated)
    ).replace("about", "");
    result.config.last_fetched_from_now = distanceInWordsToNow(
      result.config.last_fetched.toDate()
    );
    result.config.repo = repo;
    result.config.org = org;

    // Load up the sidebar
    // TODO: What if we're on a subpage!
    const projectPath = `/projects/${result.config.org}/${
      result.config.repo
      }`.toLowerCase();

    const projectSidebar = new SidebarSection(
      "Project",
      [new SelectableLink("Home", projectPath, !result.is_subpage)],
      true,
    );

    if (result.config.pages) {


      Object.keys(result.config.pages).forEach((pagePath: string) => {
        let pageName = pagePath;
        pageName = pageName.replace("/readme.md", "");
        pageName = pageName.replace(".md", "");

        const selected = (page == pagePath);
        projectSidebar.pages.push(
          new SelectableLink(pageName, `${projectPath}/${pagePath}`, selected)
        );
      });
    }

    // TODO: Const
    // TODO: Make these links real!
    const ossSidebar = new SidebarSection("Open Source", [
      new SelectableLink("Home", "#"),
      new SelectableLink("Android", "#")
    ]);
    const firebaseSidebar = new SidebarSection("Firebase", [
      new SelectableLink("Docs", "#"),
      new SelectableLink("Console", "#"),
      new SelectableLink("Blog", "#")
    ]);

    result.sidebar = [projectSidebar, ossSidebar, firebaseSidebar];

    return result;
  }

  destroyed() {
    this.cancels.forEach(c => c());
  }

  static as_id(text: String) {
    return text.toLowerCase().replace(" ", "_");
  }

  /**
   * Format the name of a related project for display.
   * Strips the "firebase/" from the name to save space, since
   * the firebase context is implied on firebaseopensource.com
   */
  fmtRelated(project: string) {
    if (project.indexOf("firebase/") >= 0) {
      return project.substring("firebase/".length, project.length);
    }

    return project;
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
