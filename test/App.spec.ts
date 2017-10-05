import { expect } from "chai";

import * as Vue from "vue";
import App from "../src/App";

const vm = new App().$mount();

describe("App", () => {
  it("should have a specific msg", () => {
    expect(vm.msg).to.equal("Welcome to Your Vue.js App");
  });
  it("should have some content in the HTML", () => {
    expect(vm.$el.querySelector("h2").innerHTML, "Essential Links");
  });
});
