const { google } = require("googleapis");

// TODO: This could be in a JSON file somewhere
const buildConfig = {
  secrets: [
    {
      kmsKeyName:
        "projects/fir-oss/locations/global/keyRings/fosdc/cryptoKeys/FIREBASE_TOKEN",
      secretEnv: {
        TOKEN:
          "CiQAltNzF1b8brQlHk459IJtppdVRodjYeQuDTulm/LYXL58GccSVwBAMMXeQ1IcfJaL7A7W7Rub/uF+31za3AiYGzcPsal59NZAzb4MOznrp5dl4aOYirKzs7DTwmDA2+qMS1eDv4Iet7I4obbpX5pdYqv5rAjVW1ktxCYo6Q=="
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
