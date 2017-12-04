let instance: Firebaseton;

import FirebaseAppModule = require("firebase/app");

export class Firebaseton {
  required = {
    firebase: FirebaseAppModule
  };
  fs: FirebaseAppModule.firestore.Firestore;

  async init() {
    await Promise.all([
      System.import("firebase"),
      System.import("isomorphic-fetch")
    ]);

    this.required.firebase = <typeof FirebaseAppModule>require("firebase/app");
    require("firebase/firestore");
    require("isomorphic-fetch");

    const config = await fetch("/__/firebase/init.json").then(response =>
      response.json()
    );

    this.required.firebase.initializeApp(config);

    this.fs = this.required.firebase.firestore();
  }

  static async get(): Promise<Firebaseton> {
    if (instance) return instance;

    instance = new Firebaseton();
    await instance.init();
    return instance;
  }
}
