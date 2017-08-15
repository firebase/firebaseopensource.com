import { isTesting } from "../utils";

export default ((obj: any) => {
  switch (isTesting()) {
    case true:
      return require("./template.html")(obj);
    case false:
      return require("./template.html?style=./style.scss")(obj);
  }
})({
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
});
