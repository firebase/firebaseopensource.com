const firebase = require("firebase/app");
require("firebase/firestore");

export class FirebaseSingleton {

  fs: any = {};

  constructor(fs: any) {
    this.fs = fs;
  }

  static async GetInstance() {
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
      })
    } catch (e) {
      console.warn("Firebase init error.");
    }

    return new FirebaseSingleton(firebase.firestore());
  }
};
