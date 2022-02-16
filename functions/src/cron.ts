const { google } = require("googleapis");

// TODO: This could be in a JSON file somewhere
const buildConfig = {
  timeout: "1800s",
  steps: [
    {
      name: "node:12",
      entrypoint: "npm",
      args: ["install"]
    },
    {
      name: "node:12",
      entrypoint: "npm",
      args: ["--prefix=frontend", "install"]
    },
    {
      name: "node:12",
      entrypoint: "npm",
      args: ["--prefix=frontend", "run", "build"]
    },
    {
      name: "node:12",
      entrypoint: "npm",
      args: ["--prefix=frontend", "run", "deploy:hosting"]
    },
  ],
  source: {
    repoSource: {
      projectId: "fir-oss",
      repoName: "firebaseopensource",
      branchName: "master"
    }
  }
};

export class Cron {
  public static async build() {
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"]
    });

    const client = google.cloudbuild({
      version: "v1",
      auth: auth
    });

    const project = await google.auth.getProjectId();

    const params = {
      projectId: project,
      requestBody: buildConfig
    };

    const res = await client.projects.builds.create(params);
    console.log(res);
  }
}
