import Homepage from "../src/components/Homepage"

export default {
  components: {
    Homepage
  },

  async asyncData(context: any) {
    console.log(`index:asyncData(${context.route.path})`);

    const data = await Homepage.load();
    const platform = undefined as any;

    return {
      platform: platform,
      categories: data.categories
    }
  }
}
