const routes = require("./routes.json").routes;

module.exports = {
  mode: "universal",
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: "/projects/:org/:repo/:page(.+)",
        component: resolve(__dirname, "pages/projects/_org/_repo/index.vue")
      });

      routes.push({
        path: "/projects-staging/:org/:repo/",
        component: resolve(__dirname, "pages/projects/_org/_repo/index.vue")
      });
      routes.push({
        path: "/projects-staging/:org/:repo/:page(.+)",
        component: resolve(__dirname, "pages/projects/_org/_repo/index.vue")
      });
    }
  },
  generate: {
    fallback: true,
    routes: routes
  },
  modules: ["~/modules/typescript.js", "@nuxtjs/sitemap"],
  sitemap: {
    path: "/sitemap.xml",
    hostname: "https://firebaseopensource.com",
    cacheTime: 1000 * 60 * 60 * 24,
    generate: true,
    routes: routes
  }
};
