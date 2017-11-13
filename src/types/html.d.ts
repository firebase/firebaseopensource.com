declare module "*.html" {
  import Vue, { Component, ComponentOptions } from "vue";
  interface WithRender {
    <V extends Component>(options: ComponentOptions<Vue>): ComponentOptions<
      Vue
    >;
    <V extends typeof Vue>(component: V): V;
  }
  const withRender: WithRender;
  export = withRender;
}
