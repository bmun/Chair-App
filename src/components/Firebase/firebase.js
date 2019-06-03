import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyCqSedobJwkr0DAFiCZta0aYA_8kvkRTRQ",
    authDomain: "my-auth-a0e06.firebaseapp.com",
    databaseURL: "https://my-auth-a0e06.firebaseio.com/",
    projectId: "my-auth-a0e06",
    storageBucket: 'my-auth-a0e06.appspot.com',
    messagingSenderId: "786823056667",
    appId: "1:786823056667:web:e08c9c298ae47ba6"
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.database = app.firestore();
        this.database.collection("testing").add({a: "aldskfjlasdkf"});
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    // *** Handling Posts ***

    createPost = post =>
    this.database.collection("committees").doc("ICPO").set({
            currPost: post,
        });
}

export default Firebase;