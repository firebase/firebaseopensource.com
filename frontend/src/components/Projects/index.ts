import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";
import { distanceInWordsToNow } from "date-fns";

import { FirebaseSingleton } from "../../services/firebaseSingleton";

import HeaderBar from "../../components/HeaderBar";
import FourOhFour from "../../components/FourOhFour";

import { Config } from "../../types/config";
import { Route } from "vue-router";
import { Env } from "../../../../shared/types";
import { Util } from "../../../../shared/util";

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
  outbound: Boolean = false;

  constructor(title: String, href: String, selected = false, outbound = false) {
    this.title = title;
    this.href = href;
    this.selected = selected;
    this.outbound = outbound;
  }
}

declare const hljs: any;

const BLOCKED_SECTIONS = ["table of contents"];

const OSS_SIDEBAR = new SidebarSection("Open Source", [
  new SelectableLink("Home", "/"),
  new SelectableLink(
    "Add Project",
    "https://github.com/firebase/firebaseopensource.com/issues/new/choose",
    false,
    true
  )
]);

const FIREBASE_SIDEBAR = new SidebarSection("Firebase", [
  new SelectableLink("Docs", "https://firebase.google.com/docs/", false, true),
  new SelectableLink(
    "Console",
    "https://console.firebase.google.com/",
    false,
    true
  ),
  new SelectableLink("Blog", "https://firebase.googleblog.com/", false, true),
  new SelectableLink(
    "YouTube",
    "https://www.youtube.com/user/Firebase",
    false,
    true
  )
]);

@Component({
  components: { HeaderBar, FourOhFour }
})
export default class Projects extends Vue {
  name = "projects";
  $route: Route;

  @Prop()
  env: Env;

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

  static async load(org: string, repo: string, page: string, env: Env) {
    console.log(`load(${org}, ${repo}, ${page}, ${env})`);
    const result = {
      sections: []
    } as any;

    // Set the environment for rendering
    result.env = env;

    const fbt = await FirebaseSingleton.GetInstance();

    const id = [org, repo].join("::");

    const projectPath = `/projects/${org}/${repo}`.toLowerCase();
    const pagePath = `${projectPath}/${page}`.toLowerCase();

    result.subheader_tabs = [
      new SelectableLink("Guides", projectPath, false, false),
      new SelectableLink(
        "GitHub",
        `https://github.com/${org}/${repo}`,
        false,
        true
      )
    ];

    // Get the path to the config and content docs, depending on the
    // display environment
    const repoDoc = fbt.fs.doc(Util.contentPath(id, env));
    const configDoc = fbt.fs.doc(Util.configPath(id, env));

    let pageContentDoc;
    if (page) {
      let page_id = page
        .split("/")
        .join("::")
        .toLowerCase();

      if (!page_id.endsWith(".md")) {
        page_id += ".md";
      }

      pageContentDoc = repoDoc.collection("pages").doc(page_id);
      result.is_subpage = true;
    } else {
      result.is_subpage = false;
      pageContentDoc = repoDoc;
    }

    // Load content
    const snapshot = await pageContentDoc.get();
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
    result.config.repo = repo;
    result.config.org = org;

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
      if (BLOCKED_SECTIONS.indexOf(section.name.toLowerCase()) >= 0) {
        return;
      }
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

    const projectSidebar = new SidebarSection(
      "Project",
      [new SelectableLink("Home", projectPath, !result.is_subpage)],
      true
    );

    if (result.config.pages) {
      const subpages: SelectableLink[] = [];
      Object.keys(result.config.pages).forEach((subPath: string) => {
        // The pages config can either look like:
        // { "path.md": true }
        // OR
        // { "path.md": "TITLE" }
        let pageName;
        const val = result.config.pages[subPath];
        if (typeof val === "string") {
          pageName = val;
        } else {
          pageName = subPath.toLowerCase();
          pageName = pageName.replace("/readme.md", "");
          pageName = pageName.replace(".md", "");
        }

        const selected = page && page.toLowerCase() === subPath.toLowerCase();
        const href = `${projectPath}/${subPath}`.toLowerCase();
        subpages.push(new SelectableLink(pageName, href, selected));
      });

      // Sort the pages by their title (alphabetically)
      subpages.sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        } else if (a.title == b.title) {
          return 0;
        } else {
          return -1;
        }
      });

      projectSidebar.pages = projectSidebar.pages.concat(subpages);
    }
    result.sidebar = [projectSidebar, OSS_SIDEBAR, FIREBASE_SIDEBAR];

    // Tabs are in this format:
    // tabs: [
    //  {
    //    title: text,
    //    href: href
    //  }
    // ]
    if (result.config.tabs) {
      result.config.tabs.forEach((tab: any) => {
        result.subheader_tabs.push(
          new SelectableLink(tab.title, tab.href, false, true)
        );
      });
    }

    return result;
  }

  get isStaging() {
    return this.env === Env.STAGING;
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

    // Enable the gooogle code prettifier
    // TODO: We should do this when doing the markdown
    document.querySelectorAll("pre code").forEach(function(el) {
      el.classList.add("prettyprint");
    });

    new Clipboard(".copy-btn");
  }
}
