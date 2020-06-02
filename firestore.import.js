// import seed data into Firestore: run `node firestore.import.js` to seed data as collections in Firestore DB.
// note. add/overwrites existing data in Firestore collections!

const firestoreService = require('firestore-export-import');
const serviceAccount = require('./serviceAccount.json');

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

const jsonToFirestore = async () => {
  try {
    console.log('Initialzing Firebase.');
    await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL);
    console.log('Initialized - begin importing seed data.');

    console.log('Importing articles.')
    await firestoreService.restore('./seeds/articles.json');
    console.log('Upload Success.');

    console.log('Importing goose tips.')
    await firestoreService.restore('./seeds/tips.json');
    console.log('Upload Success.');

    console.log('Importing schools.')
    await firestoreService.restore('./seeds/schools.json');
    console.log('Upload Success.');

    console.log('Importing school applications.')
    await firestoreService.restore('./seeds/schoolApplications.json');
    console.log('Upload Success.');

    console.log('Importing announcements.')
    await firestoreService.restore('./seeds/announcements.json');
    console.log('Upload Success.');

    console.log('Importing graphics.')
    await firestoreService.restore('./seeds/graphics.json');
    console.log('Upload Success.');

    console.log('Completed importing all seed data.')
  }
  catch (error) {
    console.log(error);
  }
};

jsonToFirestore();