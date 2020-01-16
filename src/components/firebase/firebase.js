import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const devConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
  projectId: process.env.REACT_APP_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
};

const prodConfig = {
  apiKey: process.env.REACT_APP_PROD_API_KEY,
  authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
  projectId: process.env.REACT_APP_PROD_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID,
};

const firebaseConfig = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.firestore();
  }

  // A U T H E N T I C A T I O N  A P I
  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // U S E R S
  users = () => this.db.collection("users");
  user = uid => this.db.doc(`users/${uid}`);

  // A R T I C L E S ( N e t w o r k i n g ) 
  articles = () => this.db.collection("articles");
  article = articleId => this.db.doc(`articles/${articleId}`);

  // A P P L I C A T I O N S
  schoolApplications = () => this.db.collection("schoolApplications");
  schoolApplication = uid => this.db.doc(`schoolApplications/${uid}`);

  homestayApplications = () => this.db.collection("homestayApplications");
  homestayApplication = uid => this.db.doc(`homestayApplications/${uid}`);

  airportRideApplications = () => this.db.collection("airportRideApplications");
  airportRideApplication = uid => this.db.doc(`airportRideApplications/${uid}`);
};

export default Firebase;