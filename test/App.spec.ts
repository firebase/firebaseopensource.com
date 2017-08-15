import { expect } from "chai";

import * as Vue from "vue";
import App from "../src/App";

const Constructor = Vue.extend(App);
const vm = new Constructor().$mount();

describe("App", () => {
  it("should have a specific msg", () => {
    expect(typeof App.data).to.equal("function");
    expect(vm["msg"]).to.equal("Welcome to Your Vue.js App");
    expect(vm.$el.querySelector("h2").innerHTML, "Essential Links");
  });
});
