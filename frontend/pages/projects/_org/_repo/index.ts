import Projects from "../../../../src/components/Projects"

export default {
  components: {
    Projects
  },

  head() {
    if (this.page_title) {
      return {
        title: this.page_title
      }
    }

    return {}
  },

  async asyncData(context: any) {
    console.log(`project:asyncData(${context.route.path})`);

    const org = context.params.org || context.route.params.org;
    const repo = context.params.repo || context.route.params.repo;
    const page = context.params.page || context.route.params.page;

    return await Projects.load(org, repo, page);
  }
}
