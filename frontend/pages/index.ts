import Homepage from "../src/components/Homepage"

export default {
  components: {
    Homepage
  },

  head() {
    return {
      title: "Firebase Open Source"
    }
  },

  async asyncData(context: any) {
    console.log(`index:asyncData(${context.route.path})`);

    const platform = "all";
    const data = await Homepage.load(platform);

    return {
      platform: platform,
      categories: data.categories,
      releases: data.releases
    }
  }
}
