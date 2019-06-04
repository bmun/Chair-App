import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'

const config = {
    apiKey: BLEEP,
    authDomain: BLEEP,
    databaseURL: BLEEP,
    projectId: BLEEP,
    storageBucket: BLEEP,
    messagingSenderId: BLEEP,
    appId: BLEEP
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.database = app.database();
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
    this.database.ref("users/").set({
            curr: post,
        });
}

export default Firebase;
