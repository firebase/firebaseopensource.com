const { google } = require("googleapis");

// TODO: This could be in a JSON file somewhere
const buildConfig = {
  steps: [
    {
      name: "gcr.io/cloud-builders/docker",
      args: ["build", "-t", "fir-oss/static-renderer", "."]
    },
    {
      name: "gcr.io/cloud-builders/docker",
      entrypoint: "bash",
      args: [
        "-c",
        "docker run -e GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS fir-oss/static-renderer"
      ]
    }
  ],
  source: {
    repoSource: {
      projectId: "fir-oss",
      repoName: "firebaseopensource",
      dir: "static",
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
