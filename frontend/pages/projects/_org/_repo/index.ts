import Projects from "../../../../src/components/Projects"
import { Env } from "../../../../../shared/types";

export default {
  components: {
    Projects
  },

  head() {
    const head = {
      meta: [
        {
          property: 'og:image',
          content: 'https://firebaseopensource.com/logo-small.png'
        },
        {
          property: 'og:site_name',
          content: 'Firebase Open Source'
        },
        {
          property: 'og:type',
          content: 'object'
        },
        {
          property: 'og:description',
          content: 'Check out this project on firebaseopensource.com!'
        },
      ]
    } as any

    if (this.page_title) {
      head.title = this.page_title
      head.meta.push({
        property: 'og:title',
        content: this.page_title
      });
    }

    return head;
  },

  async asyncData(context: any) {
    console.log(`project:asyncData(${context.route.path})`);

    const org = context.params.org || context.route.params.org;
    const repo = context.params.repo || context.route.params.repo;
    const page = context.params.page || context.route.params.page;

    let env: Env = Env.PROD;
    if (context.route.path.indexOf("-staging") >= 0) {
      env = Env.STAGING;
    }

    return await Projects.load(org, repo, page, env);
  }
}
