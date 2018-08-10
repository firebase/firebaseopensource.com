import Homepage from "../../../src/components/Homepage"

export default {
  components: {
    Homepage
  },

  async asyncData(context: any) {
    console.log(`platform:asyncData(${context.route.path})`);

    const data = await Homepage.load();
    const platform = context.params.platform;

    return {
      platform: platform,
      categories: data.categories
    }
  }
}
