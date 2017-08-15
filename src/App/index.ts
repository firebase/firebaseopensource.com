import { isTesting } from "../utils";

export default require("./template.html")({
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
});
