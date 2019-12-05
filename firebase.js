import * as firebase from 'firebase';
import 'firebase/firebase-firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBTJcixXATTx7ucRt2YmfHQQurWQsuHxhA",
    authDomain: "cs47-final.firebaseapp.com",
    databaseURL: "https://cs47-final.firebaseio.com",
    projectId: "cs47-final",
    storageBucket: "cs47-final.appspot.com",
    messagingSenderId: "605536495017",
    appId: "1:605536495017:web:9e9652faeb2b5fe03510b8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

export default firestore;
