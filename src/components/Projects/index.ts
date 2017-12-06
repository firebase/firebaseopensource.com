import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";
import * as distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { Firebaseton } from "../../services/firebaseton";

import HeaderBar from "../HeaderBar";

import { Config } from "../../types/config";

// Include automock for automated mocking
import "../../automock";

type Section = {
  content: String;
  name: String;
  id: String;
  ref: String;
};

declare const hljs: any;

@Component({
  components: { HeaderBar }
})
export default class Projects extends Vue {
  name = "projects";
  sections: Section[] = [];
  header: Section = { content: "", name: "", id: "", ref: "" };
  config: Config = {};
  is_subpage = false;
  dropdown_selection = "";

  async mounted() {
    const fbt = await Firebaseton.get();

    const blocked_sections = ["table of contents"];

    const id = [
      this.$route.params.organization,
      this.$route.params.repository
    ].join("::");

    const repoDoc = fbt.fs.collection("content").doc(id);

    const page = this.$route.params.page;

    let dataDoc;
    if (page) {
      let page_id = page.split("/").join("::");

      if (!page_id.endsWith(".md")) {
        page_id += ".md";
      }

      dataDoc = repoDoc.collection("pages").doc(page_id);
      this.is_subpage = true;
    } else {
      dataDoc = repoDoc;
    }

    const snapshot = await dataDoc.get();

    if (!snapshot.exists) {
      this.$router.push("/404");
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
      this.config.last_updated
    );
    this.config.repo = this.$route.params.repository;
    this.config.org = this.$route.params.organization;

    (this.$refs.header as HeaderBar).$on(
      "subheader_tab_selection:change",
      (subheader_tab_selection: string) => {
        if (subheader_tab_selection == "Github") {
          (document as any).location = `https://github.com/${
            this.$route.params.organization
          }/${this.$route.params.repository}`;
        }
      }
    );

    // const markers = document.querySelectorAll(".section-marker");
    // const tags: { [n: number]: string } = {};

    // for (let marker of markers) {
    //   tags[(marker as HTMLElement).offsetTop] = marker.getAttribute("name");
    // }

    // const tagScrollYs = Object.keys(tags)
    //   .reverse()
    //   .map(t => {
    //     return parseInt(t);
    //   });

    // var last_known_scroll_position = 0;
    // var ticking = false;

    // const doSomething = (scroll_pos: number) => {
    //   // do something with the scroll position

    //   let selection = "";
    //   for (let tagScrollY of tagScrollYs) {
    //     if (tagScrollY < scroll_pos + 10) {
    //       selection = tags[tagScrollY];
    //       break;
    //     }
    //   }
    //   this.dropdown_selection = selection;
    // };

    // window.addEventListener(
    //   "scroll",
    //   function(e) {
    //     last_known_scroll_position = window.scrollY;

    //     if (!ticking) {
    //       window.requestAnimationFrame(function() {
    //         doSomething(last_known_scroll_position);
    //         ticking = false;
    //       });

    //       ticking = true;
    //     }
    //   },
    //   true
    // );
  }

  as_id(text: String) {
    return text.toLowerCase().replace(" ", "_");
  }

  set page_title(page_title: string) {
    document.querySelector("title").innerText = page_title;
  }

  get page_title() {
    return this.page_title;
  }

  updated() {
    document.querySelectorAll("pre code").forEach(function(el) {
      hljs.highlightBlock(el);
    });
  }
}

require("./template.html")(Projects);
