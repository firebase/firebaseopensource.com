import Vue from "vue";
import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";

import HeaderBar from "../HeaderBar";

@Component({
  components: { HeaderBar }
})
export default class FourOhFour extends Vue {
  name = "four-oh-four";
}

require("./template.html")(FourOhFour);
