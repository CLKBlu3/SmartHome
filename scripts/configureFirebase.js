var config = { //use security rules later to protect the project!!
    apiKey: "AIzaSyDlOnhzfQbFGOf6lKQRGuPpqIVAqc4wUuY",
    authDomain: "pti-iot.firebaseapp.com",
    databaseURL: "https://pti-iot.firebaseio.com",
    projectId: "pti-iot"
    //No necessitem aquests de moment
    //storageBucket: "pti-iot.appspot.com",
    //messagingSenderId: "839726974850"
};
firebase.initializeApp(config);

//make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();