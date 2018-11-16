const { google } = require("googleapis");

// TODO: This could be in a JSON file somewhere
const buildConfig = {
  secrets: [
    {
      kmsKeyName:
        "projects/fir-oss/locations/global/keyRings/fosdc/cryptoKeys/FIREBASE_TOKEN",
      secretEnv: {
        TOKEN:
          "CiQAltNzF5CE3iSor7QNi6sBviZUReob8uHmfWYWq1MLGOVWrtUSVgBAMMXe+C00ExhdwrOFF0AKi6ARKPxirgTwFuOXk6rBlIwmg3Rq5roI5aL7cT8jWLOQm8PWLmt+fo07QT8do08pmNWBsmpMCZDxf5J2rGxd9pO7SAma"
      }
    }
  ],
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
        "docker run -e FIREBASE_TOKEN=$$TOKEN fir-oss/static-renderer"
      ],
      secretEnv: ["TOKEN"]
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
