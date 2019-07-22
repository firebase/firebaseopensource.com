import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";
import { distanceInWordsToNow } from "date-fns";

import { FirebaseSingleton } from "../../services/firebaseSingleton";

import HeaderBar from "../../components/HeaderBar";
import FourOhFour from "../../components/FourOhFour";

import { Route } from "vue-router";
import { Env, StoredProjectConfig, TabConfig, PageConfig } from "../../../../shared/types";
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
    "https://github.com/firebase/firebaseopensource.com/issues/new?template=new_project.md",
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

interface RepoInfo {
  org: string;
  repo: string;
  stars: number;
}

interface DisplayTimestamps {
  last_updated_from_now: string;
  last_fetched_from_now: string;
}

interface RelatedRepo {
  name: string;
  path: string;
}

interface ProjectArgs {
  env: Env;

  page_title: String;
  sections: Section[];
  header: Section;
  subheader_tabs: SelectableLink[];
  sidebar: SidebarSection[];
  related_repos: RelatedRepo[];

  info: RepoInfo;
  timestamps: DisplayTimestamps;

  // TODO: How can we possibly need found and not_found
  is_subpage: Boolean;
  not_found: Boolean;
  found: Boolean;

  // TODO: Do we need this?
  dropdown_selection: String;
}

@Component({
  components: { HeaderBar, FourOhFour }
})
export default class Projects extends Vue implements ProjectArgs {
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
  info: RepoInfo;
  @Prop()
  timestamps: DisplayTimestamps;
  @Prop()
  is_subpage: Boolean;
  @Prop()
  dropdown_selection: String;
  @Prop()
  not_found: Boolean;
  @Prop()
  found: Boolean;
  @Prop()
  subheader_tabs: SelectableLink[];
  @Prop()
  sidebar: SidebarSection[];
  @Prop()
  related_repos: RelatedRepo[];

  cancels: Function[];
  show_clone_cmd: Boolean = false;

  static async load(org: string, repo: string, page: string, env: Env): Promise<ProjectArgs> {
    console.log(`load(${org}, ${repo}, ${page}, ${env})`);
    const result = {
      sections: []
    } as ProjectArgs;

    // Set the environment for rendering
    result.env = env;

    const fbt = await FirebaseSingleton.GetInstance();

    const id = [org, repo].join("::");
    const projectPath = `/projects/${org}/${repo}`.toLowerCase();

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
    const repoConfigRef = fbt.fs.doc(Util.configPath(id, env));
    const repoContentRef = fbt.fs.doc(Util.contentPath(id, env));

    let pageContentDoc: firebase.firestore.DocumentReference;
    if (page) {
      let page_id = page
        .split("/")
        .join("::")
        .toLowerCase();

      if (!page_id.endsWith(".md")) {
        page_id += ".md";
      }

      pageContentDoc = repoContentRef.collection("pages").doc(page_id);
      result.is_subpage = true;
    } else {
      result.is_subpage = false;
      pageContentDoc = repoContentRef;
    }

    // Load content
    const contentSnap = await pageContentDoc.get();
    if (!contentSnap.exists) {
      console.warn(`No content at page: ${pageContentDoc.path}`);
      result.not_found = true;
    } else {
      result.not_found = false;
    }
    const data = contentSnap.data();

    // Load config
    const configSnap = await repoConfigRef.get();
    if (configSnap.exists && !result.not_found) {
      result.found = true;
    }
    const configData = configSnap.data() as StoredProjectConfig;

    // Basic Github info
    result.info = {
      org,
      repo,
      stars: configData.stars
    };

    // Choose the page name depending on available info:
    // Option 0 - title of the header section
    // Option 1 - the name from the config.
    // Option 2 - the repo name
    if (data.header.name) {
      result.page_title = data.header.name;
    } else if (configData.name) {
      result.page_title = configData.name;
    } else {
      result.page_title = repo;
    }

    const sections = contentSnap.data().sections as Section[];
    result.header = data.header as Section;

    sections.forEach(section => {
      if (BLOCKED_SECTIONS.indexOf(section.name.toLowerCase()) >= 0) {
        return;
      }
      section.id = this.formatAsId(section.name);
      section.ref = "#" + section.id;
      result.sections.push(section);
    });

    const last_updated_from_now = distanceInWordsToNow(
      new Date(configData.last_updated)
    ).replace("about", "");
    const last_fetched_from_now = distanceInWordsToNow(
      configData.last_fetched.toDate()
    );

    result.timestamps = {
      last_updated_from_now,
      last_fetched_from_now
    }

    const projectSidebar = new SidebarSection(
      "Project",
      [new SelectableLink("Home", projectPath, !result.is_subpage)],
      true
    );

    if (configData.pages) {
      const subpages: SelectableLink[] = [];
      for (const pageConfig of configData.pages) {
        let pageName;
        if (pageConfig.name) {
          pageName = pageConfig.name;
        } else {
          pageName = pageConfig.path.toLowerCase();
          pageName = pageName.replace("/readme.md", "");
          pageName = pageName.replace(".md", "");
        }

        const selected = page && page.toLowerCase() === pageConfig.path.toLowerCase();
        const href = `${projectPath}/${pageConfig.path}`.toLowerCase();
        subpages.push(new SelectableLink(pageName, href, selected));
      }
      projectSidebar.pages = projectSidebar.pages.concat(subpages);
    }
    result.sidebar = [projectSidebar, OSS_SIDEBAR, FIREBASE_SIDEBAR];

    // Add each "tab" as a link in the subheader
    if (configData.tabs) {
      configData.tabs.forEach((tab: TabConfig) => {
        result.subheader_tabs.push(
          new SelectableLink(tab.title, tab.href, false, true)
        );
      });
    }

    // Related repos
    result.related_repos = this.relatedRepos(configData);

    return result;
  }

  static formatAsId(text: String) {
    return text.toLowerCase().replace(" ", "_");
  }

  static relatedRepos(config: StoredProjectConfig): RelatedRepo[] {
    if (!config.related) {
      return [];
    }

    return Object.keys(config.related).map((repo: string) => {
      // Format the name of a related project for display.
      // Strips the "firebase/" from the name to save space, since
      // the firebase context is implied on firebaseopensource.com
      let name = repo;
      if (repo.indexOf("firebase/") >= 0) {
        name = repo.substring("firebase/".length, repo.length);
      }
  
      return {
        name,
        path: repo
      }
    });
  }
  get isStaging() {
    return this.env === Env.STAGING;
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

    new Clipboard(".copy-btn");
  }

  destroyed() {
    this.cancels.forEach(c => c());
  }
}
