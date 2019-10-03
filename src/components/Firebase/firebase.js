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

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

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
        this.database.collection(committee).doc(type).get();



    // *** User API ***

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    setDelegates = (committee, list) => {
        for (let i = 0; i < list.length; i++) {
            this.database.collection(committee).doc("delegates").collection("delegates").doc(list[i]).set({
                name: list[i]
            })
        }
    };

    // *** Grading API

    getDelegates = (committee) =>
        this.database.collection('committees').doc(committee).collection('delegates').get();

    submitFeedback = (committee, delegate, comments, score) => {
        this.database.collection('committees').doc(committee).collection('delegates').doc(delegate).collection('feedback').add({
            comments: comments,
            score: score,
        });
    }

    getFeedback = async (committee) => {
        const delegates = await this.getDelegates(committee);
        const delegateList = delegates.docs.map(delegates => delegates.get("country"));
        return await Promise.all(delegateList.map(async (delegate) => {
            const feedbackDocs = await this.database
                .collection('committees')
                .doc(committee)
                .collection('delegates')
                .doc(delegate)
                .collection('feedback')
                .get();
            const feedback = feedbackDocs.docs.map(feedback => feedback.data());
            return {
                country: delegate,
                feedback: feedback,
            }
        }));
    }
}


export default Firebase;


