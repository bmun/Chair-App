import app from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import * as DBCONFIG from '../../constants/dbconfig'


const config = {
    apiKey: DBCONFIG.apiKey,
    authDomain: DBCONFIG.authDomain,
    databaseURL: DBCONFIG.databaseURL,
    projectId: DBCONFIG.projectId,
    storageBucket: DBCONFIG.storageBucket,
    messagingSenderId: DBCONFIG.messagingSenderId,
    appId: DBCONFIG.appId
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.firestore();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);


    // POST API

    createPost = content =>
        this.db.collection("committees").doc("ICPO").set({
            currPost:  content
        })
}

export default Firebase;


