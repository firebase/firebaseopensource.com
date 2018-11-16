const { google } = require('googleapis');

import * as rp from 'request-promise-native';

export class Cron {

    public static async build() {
        const auth = await google.auth.getClient({
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        const client = google.cloudbuild({
            version: 'v1',
            auth: auth
        });

        const project = await google.auth.getProjectId();

        const params = {
            projectId: project,
            requestBody: require('../config/cloudbuild.json')
        };

        const res = await client.projects.builds.create(params);
        console.log(res);
    }

    public static async fetchAllProjects() {
        const res = await rp('https://us-central1-fir-oss.cloudfunctions.net/getAllProjects');
        console.log(res);
    }

}