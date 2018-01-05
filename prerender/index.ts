/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as fetch from 'isomorphic-fetch';
import * as fs from 'fs-extra';
import { Observable } from 'rxjs/Observable';
import { tap, map, filter, mergeMap, takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs/Observable/combineLatest';
import { from } from 'rxjs/Observable/from';
import { spawnDetached } from 'spawn-rx';
import * as chalk from 'chalk';
import { minify } from 'html-minifier';
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
  'firebase::functions-samples',
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

function prerender({ app, localUrl, rendertronUrl }: PrerenderOptions) {
  return new Observable(subscriber => {
    const projects = PROJECTS;
    const promises = projects.map(async id => {
      const pieces = id.split('::');
      const org = pieces[0];
      const projectId = pieces[1];
      const path = `${org}/${projectId}`;
      const res = await fetch(`${RENDERTON_URL}/render/${BASE_URL}/projects/${path}`);
      const html = await res.text();
      // Save some bytes by minifying the document
      const minHtml = minify(html, {
        minifyCSS: true,
        collapseWhitespace: true
      });
      fs.mkdirpSync(`${__dirname}/${org}`)
      fs.writeFileSync(`${__dirname}/${path}.html`, minHtml, 'utf8');
      chalk.default.greenBright(`Wrote: ${__dirname}/${path}.html`);
    });
    Promise.all(promises).then(_ => subscriber.complete());
  });
}

/**
 * Create an child process observable that only emits once a condition
 * is statified. This condition indicates that the child process has
 * launched or done enough work to use.
 * @param cmd
 * @param args
 * @param matchingCondition
 */
function spawnLaunched(cmd: string, args: string[], matchingCondition: string) {
  return spawnDetached(cmd, args).pipe(
    tap(data => console.log(chalk.default.gray(data.toString()))),
    map(data => data.toString().indexOf(matchingCondition) > 0),
    filter(hasLaunched => hasLaunched)
  );
}

console.log(chalk.default.greenBright('Starting Firebase Hosting and Rendertron servers...'));
const serveCmd = spawnLaunched('firebase', ['serve'], 'Local server: http://localhost:5000');
const rendertronCmd = spawnLaunched('rendertron', [], 'port 3000');
const server$ = combineLatest(serveCmd, rendertronCmd).pipe(
  tap(_ => {
    console.log(chalk.default.greenBright('Firebase Hosting and Rendertron are up and running!'));
    console.log(chalk.default.greenBright('Starting Pre-render...'));
  })
);

// TODO(davideast): Fix dirty inner sub hack
// Need to find a way to end the server processes
// once the pre-render process completes
const serverSub = server$
  .subscribe(_ => {
    const preSub = prerender({ localUrl: BASE_URL, rendertronUrl: RENDERTON_URL })
      .subscribe(
        _ => {}, // next
        _ => {}, // error
        () => { // completed
          console.log(chalk.default.redBright('Tearing down...'));
          serverSub.unsubscribe();
          process.exit(0);
        });
  });
