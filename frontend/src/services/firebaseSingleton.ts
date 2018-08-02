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
import FirebaseAppModule = require("firebase/app");

let singleton: FirebaseSingleton;
let waitForSingleton: Promise<FirebaseSingleton>;

export class FirebaseSingleton {
  required = {
    firebase: FirebaseAppModule
  };
  fs: FirebaseAppModule.firestore.Firestore;

  async init() {
    await Promise.all([System.import("firebase/app")]);

    this.required.firebase = <typeof FirebaseAppModule>require("firebase/app");
    require("firebase/firestore");

    this.required.firebase.initializeApp({
      apiKey: "AIzaSyDFjAR2cS_QCghJ_HtKdZK06VpcqxDBt9g",
      databaseURL: "https://fir-oss.firebaseio.com",
      storageBucket: "fir-oss.appspot.com",
      authDomain: "fir-oss.firebaseapp.com",
      messagingSenderId: "895878195922",
      projectId: "fir-oss"
    });

    this.fs = this.required.firebase.firestore();
    this.fs.settings({
      timestampsInSnapshots: true
    });

    return this;
  }

  public static async GetInstance() {
    if (singleton) {
      return singleton;
    } else if (waitForSingleton) {
      return waitForSingleton;
    } else {
      return (waitForSingleton = new FirebaseSingleton()
        .init()
        .then(_singleton => {
          return (singleton = _singleton);
        }));
    }
  }
}
