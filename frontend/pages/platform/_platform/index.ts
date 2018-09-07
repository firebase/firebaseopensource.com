import Homepage from "../../../src/components/Homepage"

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
    console.log(`platform:asyncData(${context.route.path})`);

    const platform = context.params.platform;
    const data = await Homepage.load(platform);

    return {
      platform: platform,
      categories: data.categories
    }
  }
}
