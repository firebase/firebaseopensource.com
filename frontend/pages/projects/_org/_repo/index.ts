import Projects from "../../../../src/components/Projects"

// TODO
type Section = {
  content?: String;
  name?: String;
  id?: String;
  ref?: String;
};

export default {
  components: {
    Projects
  },

  async asyncData(context: any) {
    console.warn('context', context.params);
    return await Projects.load(context.params.org, context.params.repo)
  }
}
