import Vue from "vue";
import {createRenderer} from "vue-server-renderer"

import {app} from "./main"

// Step 2: Create a renderer
const renderer = createRenderer(
    {template: `<!DOCTYPE html>
<html lang="en">
  <head><title>Hello</title></head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
`}
);

app.$router.push("/projects/firebase/firebaseui-android");

app.$router.onReady(async () => {
    const matchedComponents = app.$router.getMatchedComponents();

    const state = await Promise.all(matchedComponents.map(async Component => {
        const c = new (Component as any)();
        if (c.load) {
            await c.load()
        }
        const html = await renderer.renderToString(c);
        require("fs").writeFileSync("./ssr.html", html);
        process.exit();
    }));
});