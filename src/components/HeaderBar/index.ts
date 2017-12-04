import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";

@Component
export default class HeaderBar extends Vue {
  name = "header-bar";
  headers = [{}, { spacer: true }];

  @Prop() spacer: boolean;

  @Prop() enable_subheader: boolean;

  @Prop() subheader_title: string;

  @Prop() subheader_tabs: string[];

  subheader_tab_selection = "";

  @Watch("subheader_tabs", { immediate: true })
  onSubheaderTabsChange() {
    if (this.subheader_tabs && this.subheader_tabs.length) {
      this.subheader_tab_selection = this.subheader_tabs[0];
    }
  }

  setSubheaderTabSelection(tab: string) {
    Vue.set(this, "subheader_tab_selection", tab);
  }
}

require("./template.html")(HeaderBar);
