import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const devConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
  projectId: process.env.REACT_APP_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
}

const prodConfig = {
  apiKey: process.env.REACT_APP_PROD_API_KEY,
  authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
  projectId: process.env.REACT_APP_PROD_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID,
}

const firebaseConfig = devConfig;
// const firebaseConfig = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
    this.fieldValue = app.firestore.FieldValue;
  }

  // A U T H  U S E R  M E R G E  W I T H  F I R E S T O R E  D O C U M E N T
  onAuthUserListener = (next, fallback) => {
    this.auth.onAuthStateChanged(authUser => {
      if (authUser){
        const userQuery = this.user(authUser.uid).get();
        userQuery.then(snapshot => {
          const user = snapshot.data();

          authUser = {
            uid: authUser.uid,
            displayName: authUser.displayName || user.username,
            email: authUser.email || user.email,
            metadata: {...authUser.metadata},
            roles: user.roles,
          }

          next(authUser);

        });
      } else {
        fallback();
      }
    }) 
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
  deleteUser = uid => this.db.doc(`users/${uid}`).delete();

  // G O O S E  T I P S
  tips = () => this.db.collection("tips");
  tip = tipId => this.db.doc(`tips/${tipId}`);
  deleteTip = tipId => this.db.doc(`tips/${tipId}`).delete();

  // A R T I C L E S ( N e t w o r k i n g ) 
  articles = () => this.db.collection("articles");
  article = articleId => this.db.doc(`articles/${articleId}`);
  deleteArticle = articleId => this.db.doc(`articles/${articleId}`).delete();

  // S C H O O L S 
  schools = () => this.db.collection("schools");
  school = schoolId => this.db.doc(`schools/${schoolId}`);
  deleteSchool = schoolId => this.db.doc(`schools/${schoolId}`).delete();

  // A P P L I C A T I O N S
  schoolApplications = () => this.db.collection("schoolApplications");
  schoolApplication = uid => this.db.doc(`schoolApplications/${uid}`);
  deleteSchoolApplication = uid => this.db.doc(`schoolApplications/${uid}`).delete();

  homestayApplications = () => this.db.collection("homestayApplications");
  homestayApplication = uid => this.db.doc(`homestayApplications/${uid}`);
  deleteHomestayApplication = uid => this.db.doc(`homestayApplications/${uid}`).delete();

  airportRideApplications = () => this.db.collection("airportRideApplications");
  airportRideApplication = uid => this.db.doc(`airportRideApplications/${uid}`);
  deleteAirportRideApplication = uid => this.db.doc(`airportRideApplications/${uid}`).delete();

  // A N N O U N C E M E N T S
  announcements = () => this.db.collection("announcements");
  announcement = announcementId => this.db.doc(`announcements/${announcementId}`);

  // M E S S A G E S
  messages = () => this.db.collection("messages");
  message = messageId => this.db.doc(`messages/${messageId}`);
  deleteMessage = messageId => this.db.doc(`messages/${messageId}`).delete();

  // U P L O A D S
  imagesRef = file => this.storage.ref('images').child(file.name);
  attachmentsRef = file => this.storage.ref('attachments').child(file.name);

  // S T A T I C  A S S E T S
  graphics = () => this.db.collection("graphics");
  graphic = graphicId => this.db.collection("graphics").doc(graphicId);

  // H E L P E R S
  transaction = doc => this.db.runTransaction(doc);   // a set of read and write operations on one or more documents
  updateArray = () => this.fieldValue;  // to merge & update an array in an existing document (e.g. comments)
  batch = () => this.db.batch(); // to execute multiple operations (set, update, delete) without needing to read them
};

export default Firebase;