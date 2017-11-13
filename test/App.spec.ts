import { expect } from "chai";

import App from "../src/components/App";

describe("App", () => {
  let vm = new App();

  it("should have a specific msg", () => {
    expect(vm.msg).to.equal("Welcome to Your Vue.js App");
  });

  it("should have some content in the HTML", () => {
    expect(vm.$el.querySelector("h2").innerHTML, "Essential Links");
  });
});
