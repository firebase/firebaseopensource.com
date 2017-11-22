import * as fetch from 'isomorphic-fetch';
import * as fs from 'fs-extra';
import * as firebase from 'firebase';
// import 'firebase/firestore';

// const app = firebase.initializeApp({
//   apiKey: "AIzaSyDFjAR2cS_QCghJ_HtKdZK06VpcqxDBt9g",
//   authDomain: "fir-oss.firebaseapp.com",
//   databaseURL: "https://fir-oss.firebaseio.com",
//   projectId: "fir-oss",
//   storageBucket: "fir-oss.appspot.com",
//   messagingSenderId: "895878195922"
// });

const RENDERTON_URL = 'http://localhost:3000';
const BASE_URL = 'http://localhost:5000';
const PROJECTS = [
  'firebase::angularfire',
  'firebase::firebaseui-android',
];

export interface PrerenderOptions {
  app?: firebase.app.App;
  localUrl: string;
  rendertronUrl: string;
}

async function getProjects(app: firebase.app.App) {
  const snaps = await app.firestore().collection('configs').get();
  return snaps.docs.map(d => d.id);
}

async function prerender({ app, localUrl, rendertronUrl }: PrerenderOptions) {
  const projects = PROJECTS;
  const promises = projects.map(async id => {
    const pieces = id.split('::');
    const org = pieces[0];
    const projectId = pieces[1];
    const path = `${org}/${projectId}`;
    const res = await fetch(`${RENDERTON_URL}/render/${BASE_URL}/projects/${path}`);
    const html = await res.text();
    await fs.mkdirp(`${__dirname}/${org}`)
    await fs.writeFile(`${__dirname}/${path}.html`, html, 'utf8');
  });
  return Promise.all(promises);
}

prerender({ localUrl: BASE_URL, rendertronUrl: RENDERTON_URL })
  .then(_ => { console.log('Done!'); })
  .catch(console.log);
