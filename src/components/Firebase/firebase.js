import app from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
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
        this.database = app.firestore();
        this.db = app.database();
    }

    doCreateUserWithEmailAndPassword = (email, password) => {
        let a = this.auth.createUserWithEmailAndPassword(email, password);
        return a};

    doSetUsername = (username) =>
        this.auth.currentUser.updateProfile({displayName: username});

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);


    // POST API

    createPost = (committee, content) =>
        this.database.collection(committee).doc("billboard").set({
            currPost:  content
        });

    getPost = committee =>
        this.database.collection(committee).doc("billboard").get();

    setTable = (committee, type, data) =>
        this.database.collection(committee).doc(type).set({
            table: data
        });

    getTable = (committee, type) =>
        this.database.collection(committee).doc(type).get()



    // *** User API ***

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    setDelegates = (committee, list) => {
            this.database.collection(committee).doc("delegates").set({
                delegates: list
            })
    }
}


export default Firebase;


