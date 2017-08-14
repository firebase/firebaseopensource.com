declare module "*.html" {
  import Vue = require("vue");
  interface WithRender {
    <V extends Vue>(options: Vue.ComponentOptions<V>): Vue.ComponentOptions<V>;
    <V extends typeof Vue>(component: V): V;
  }
  const withRender: WithRender;
  export = withRender;
}
