const functions = require('firebase-functions');
const admin = require('firebase-admin');
const PDFDocument = require('pdfkit');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const bucket = admin.storage().bucket();
const FieldValue = admin.firestore.FieldValue;

// C L O U D  F U N C T I O N S
// !change.before.exists = no existing document in collection BEFORE update = document created + add one to total field;
// !change.after.exists = no existing document in collection AFTER update = document deleted + subtract one from total field;

exports.aggregateTips = functions.firestore
  .document('tips/{tipId}')
  .onWrite((change, context) => {
    const tipRef = db.collection('aggregates').doc('tips');
    const aggregateTips = configureAggregateHelpers(tipRef, 1, '', change);
    return aggregateTips;
});

exports.aggregateMessages = functions.firestore
  .document('messages/{messageId}')
  .onWrite((change, context) => {
    const messageRef = db.collection('aggregates').doc('messages');
    const aggregateMessages = configureAggregateHelpers(messageRef, 1, '', change);
    return aggregateMessages;
});

exports.aggregateAirportRideApplications = functions.firestore
  .document('airportRideApplications/{airportRideApplicationId}')
  .onWrite((change, context) => {
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    const aggregateOtherApplications = configureAggregateHelpers(otherApplicationsRef, 1, 'airportRidesTotal', change);
    return aggregateOtherApplications;
});

exports.aggregateHomestayApplications = functions.firestore
  .document('homestayApplications/{homestayApplicationId}')
  .onWrite((change, context) => {
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    const aggregateOtherApplications = configureAggregateHelpers(otherApplicationsRef, 1, 'homestayTotal', change);
    return aggregateOtherApplications;
});

exports.aggregateSchoolApplications = functions.firestore
  .document('schoolApplications/{schoolApplicationId}')
  .onWrite(async (change, context) => {
    // A G G R E G A T E (total number of applications by school);
    // const schoolsRef = db.collection('aggregates').doc('schools');
    // const school = change.after.get('schoolName');
    // const aggregateSchools = (!change.after.exists) ? await aggregateTotalsTransaction(schoolsRef, -1, school) : await aggregateTotalsTransaction(schoolsRef, 1, school);

    // A G G R E G A T E (total number of applications by status); 
    // const applicationsRef = db.collection('aggregates').doc('schoolApplications');
    // const aggregateApplications = await configureAggregateHelpers(applicationsRef, 1, 'status', change);

    // O T H E R (create downloadable PDF of school application);
    const newApplicationData = change.after.data();
    const applicationId = context.params.schoolApplicationId;
    const generatePDFApplication = await generatePDF(applicationId, newApplicationData, change);

    Promise.all([generatePDFApplication])
    .catch(err => console.log('Caught error in schoolApplications parent trigger ', err));
});

exports.aggregateArticles = functions.firestore
  .document('articles/{articleId}')
  .onWrite((change, context) => {
    const articleRef = db.collection('aggregates').doc('articles');
    const aggregateArticles = configureAggregateHelpers(articleRef, 1, 'tag', change);
    return aggregateArticles;
});

exports.aggregateAnnounces = functions.firestore
  .document('announcements/{announceId}')
  .onWrite((change, context) => {
    const announceRef = db.collection('aggregates').doc('announcements');
    const aggregateAnnounces = configureAggregateHelpers(announceRef, 1, 'tag', change);
    return aggregateAnnounces;
});

// H E L P E R  F U N C T I O N S
const configureAggregateHelpers = (ref, increment, field, change) => {
  
  let aggregateValues;
  
  if (field) {
    const checkNestedTotals = field === 'airportRidesTotal' || field === 'homestayTotal';
    const newValue = change.after.get(field);
    const oldValue = change.before.get(field);

    if (checkNestedTotals) {
      aggregateValues = (!change.after.exists) ? aggregateTotalsTransaction(ref, -increment, field) : aggregateTotalsTransaction(ref, increment, field);
    } else if (!change.before.exists) {
      aggregateValues = aggregateTotalsTransaction(ref, increment, newValue);
    } else if (!change.after.exists) {
      aggregateValues = aggregateMultiTotalsTransaction(ref, -increment, oldValue, newValue);
    } else {
      aggregateValues = aggregateMultiTotalsTransaction(ref, increment, oldValue, newValue);
    }

  } else {
    aggregateValues = (!change.after.exists) ? aggregateTotalsTransaction(ref, -increment) : aggregateTotalsTransaction(ref, increment);
  }

  return aggregateValues;
}

const aggregateTotalsTransaction = (ref, increment, field) => {
  return db.runTransaction(transaction => {
    return transaction.get(ref)
    .then(doc => {
      if (!doc.exists) {
        console.log('Document does not exist!');
        return;
      }
      if (field) {
        transaction.set(ref, {
          [field]: FieldValue.increment(increment), 
          total: FieldValue.increment(increment)
        }, { merge: true });
      } else {
        transaction.set(ref, {total: FieldValue.increment(increment)}, { merge: true });
      }
      return true;
    });
  })
  .then(() => { 
    console.log(`Update (${increment}) transaction successfully committed!`);
    return true;
  })
  .catch(error => { 
    console.log(`Update (${increment}) transaction failed: `, error);
    return;
  });
}

const aggregateMultiTotalsTransaction = (ref, increment, prevField, newField) => {
  return db.runTransaction(transaction => {
    return transaction.get(ref)
    .then(doc => {
      if (!doc.exists) {
        console.log('Document does not exist!');
        return;
      }

      if (Math.sign(increment) === -1) {
        transaction.set(ref, {
          [prevField]: FieldValue.increment(increment),
          [newField]: FieldValue.increment(increment), 
          total: FieldValue.increment(increment)
        }, { merge: true });
      } else {
        transaction.set(ref, {
          [prevField]: FieldValue.increment(-increment),
          [newField]: FieldValue.increment(increment), 
        }, { merge: true });
      }
      return true;
    });
  })
  .then(() => { 
    console.log(`Update (${increment}) transaction successfully committed!`);
    return true;
  })
  .catch(error => { 
    console.log(`Update (${increment}) transaction failed: `, error);
    return;
  });
}

async function generatePDF(id, form, change) {
  let schoolApplicationRef = db.collection('schoolApplications').doc(`${id}`);
  let filename = `applications/${form.schoolName}-${id}.pdf`;
  let file = bucket.file(filename);                         // BUCKET METHOD: creates a File object from Bucket (methods: createWriteStream, getSignedUrl);

  const checkIfFileExists = await file.exists();
  
  if (checkIfFileExists[0]) {
    // console.log(`File already exists in Storage for ${id}.`);
    
    if (!form.downloadUrl) {
      // console.log(`Missing download URL in Firebase for ${id}.`);
      return generateDownloadUrl(schoolApplicationRef, form, file);
    }
    // console.log("Nothing to do, file and download URL exists.")
    return;
  }

  const doc = new PDFDocument;                              // create an instance = READABLE Node stream;
  const bucketFileStream = file.createWriteStream();        // FILE METHOD: creates a writeable stream to overwrite the contents of the file in your bucket;

  doc.pipe(bucketFileStream);                               // send the output of the PDF document to another WRITABLE Node stream;
  
  doc.end();                                                // finalize the PDF file;

  bucketFileStream.on('finish', () => {
    // console.log(`Finished writeable stream for ${id}.`);
    return generateDownloadUrl(schoolApplicationRef, form, file);
  });

  bucketFileStream.on('error', e => {
    console.error(e);
  });
}

function generateDownloadUrl(ref, form, file) {
  try {
    return file.getSignedUrl({action: 'read', expires: '03-17-2025'}).then(signedUrl => {
      if (signedUrl[0] === form.downloadUrl) {
        console.log('I have nothing to do!');
        return;
      }
      return ref.set({ downloadUrl: signedUrl[0] }, { merge: true });
    });
  } catch(e) {
    console.log(`Caught error in access and set download URL to Firebase for ${form.authorID}: `, e)
  }
}