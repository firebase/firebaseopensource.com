import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
  const config = {
    apiKey: 'AIzaSyDFjAR2cS_QCghJ_HtKdZK06VpcqxDBt9g',
    databaseURL: 'https://fir-oss.firebaseio.com',
    storageBucket: 'fir-oss.appspot.com',
    authDomain: 'fir-oss.firebaseapp.com',
    messagingSenderId: '895878195922',
    projectId: 'fir-oss'
    // appId: 'noidea' //TODO
  }
  firebase.initializeApp(config)
}
const fireStore = firebase.firestore()
export { fireStore }
