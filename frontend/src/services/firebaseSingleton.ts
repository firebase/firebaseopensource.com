import * as firebase from "firebase/app";
require("firebase/firestore");

export class FirebaseSingleton {
  private static instance: FirebaseSingleton = undefined;

  fs: firebase.firestore.Firestore;

  constructor(fs: firebase.firestore.Firestore) {
    this.fs = fs;
  }

  static async GetInstance() {
    if (!this.instance) {
      try {
        firebase.initializeApp({
          apiKey: "AIzaSyDFjAR2cS_QCghJ_HtKdZK06VpcqxDBt9g",
          databaseURL: "https://fir-oss.firebaseio.com",
          storageBucket: "fir-oss.appspot.com",
          authDomain: "fir-oss.firebaseapp.com",
          messagingSenderId: "895878195922",
          projectId: "fir-oss"
        });
        firebase.firestore().settings({
          timestampsInSnapshots: true
        });
      } catch (e) {
        console.warn("Firebase init error.");
      }

      this.instance = new FirebaseSingleton(firebase.firestore());
    }

    return this.instance;
  }
}
