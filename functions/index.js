const functions = require('firebase-functions');
const admin = require('firebase-admin');
const PDFDocument = require('pdfkit');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const bucket = admin.storage().bucket();
const FieldValue = admin.firestore.FieldValue;

// C L O U D  F U N C T I O N S
exports.aggregateTips = functions.firestore
  .document('tips/{tipId}')
  .onWrite((change, context) => {
    const tipRef = db.collection('aggregates').doc('tips');
    return configureAggregateHelpers(tipRef, 1, '', change);
});

exports.aggregateMessages = functions.firestore
  .document('messages/{messageId}')
  .onWrite((change, context) => {
    const messageRef = db.collection('aggregates').doc('messages');
    return configureAggregateHelpers(messageRef, 1, '', change);
});

exports.aggregateAirportRideApplications = functions.firestore
  .document('airportRideApplications/{airportRideApplicationId}')
  .onWrite((change, context) => {
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    return configureAggregateHelpers(otherApplicationsRef, 1, 'airportRidesTotal', change);
});

exports.aggregateHomestayApplications = functions.firestore
  .document('homestayApplications/{homestayApplicationId}')
  .onWrite((change, context) => {
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    return configureAggregateHelpers(otherApplicationsRef, 1, 'homestayTotal', change);
});

exports.aggregateSchoolApplications = functions.firestore
  .document('schoolApplications/{schoolApplicationId}')
  .onWrite(async (change, context) => {
    // A G G R E G A T E (total number of applications by school);
    const schoolsRef = db.collection('aggregates').doc('schools');
    const aggregateSchools = configureAggregateHelpers(schoolsRef, 1, 'customField', change);

    // A G G R E G A T E (total number of applications by status); 
    const applicationsRef = db.collection('aggregates').doc('schoolApplications');
    const aggregateApplications = configureAggregateHelpers(applicationsRef, 1, 'status', change);

    // O T H E R (create PDF with downloadable link of school application);
    // const newApplicationData = change.after.data();
    const applicationId = context.params.schoolApplicationId;
    const generatePDFApplication = generatePDF(applicationId, change);

    await Promise.all([aggregateSchools, aggregateApplications, generatePDFApplication])
    .catch(console.error);
});

exports.aggregateArticles = functions.firestore
  .document('articles/{articleId}')
  .onWrite((change, context) => {
    const articleRef = db.collection('aggregates').doc('articles');
    return configureAggregateHelpers(articleRef, 1, 'tag', change);
});

exports.aggregateAnnounces = functions.firestore
  .document('announcements/{announceId}')
  .onWrite((change, context) => {
    const announceRef = db.collection('aggregates').doc('announcements');
    return configureAggregateHelpers(announceRef, 1, 'tag', change);
});

// H E L P E R  F U N C T I O N S
// !change.before.exists = no existing document in collection BEFORE update = document created + add one to total field;
// !change.after.exists = no existing document in collection AFTER update = document deleted + subtract one from total field;

const configureAggregateHelpers = (ref, increment, field, change) => {
  let aggregateValues;
  switch(true) {
    case field === 'customField': 
      if (!change.before.exists) aggregateValues = aggregateTotalsTransaction(ref, increment, change.after.get('schoolName'));
      if (!change.after.exists) aggregateValues = aggregateTotalsTransaction(ref, -increment, change.before.get('schoolName'));
      break;
    
    case field !== '' && field !== 'customField': {
      const newValue = change.after.get(field);
      const oldValue = change.before.get(field);
      const checkNestedTotals = field === 'airportRidesTotal' || field === 'homestayTotal';

      switch(true) {
        case checkNestedTotals: 
          aggregateValues = (!change.after.exists) ? aggregateTotalsTransaction(ref, -increment, field) : aggregateTotalsTransaction(ref, increment, field);
          break;
        
        case !change.before.exists:
          aggregateValues =  aggregateTotalsTransaction(ref, increment, newValue);
          break;

        case !change.after.exists:
          aggregateValues = aggregateMultiTotalsTransaction(ref, -increment, oldValue, newValue);
          break;
        
        default:
          aggregateValues = aggregateMultiTotalsTransaction(ref, increment, oldValue, newValue);
      }
      break;
    }
    
    default: 
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
      const operations = (field) ? { [field]: FieldValue.increment(increment), total: FieldValue.increment(increment) } : { total: FieldValue.increment(increment) };
      return transaction.set(ref, operations, { merge: true });
    });
  }).then(() => { 
    console.log(`Update single/total aggregate (${increment}) transaction successfully committed!`);
    return true;
  }).catch(console.error);
}

const aggregateMultiTotalsTransaction = (ref, increment, prevField, newField) => {
  return db.runTransaction(transaction => {
    return transaction.get(ref).then(doc => {
      if (!doc.exists) {
        console.log('Document does not exist!');
        return;
      }
      
      if (prevField === newField) {
        console.log('Nothing happens - trying to multi update the same fields (prevField, newField).')
        return;
      }
      
      let operations;
      if (Math.sign(increment) === -1) {
        operations = (newField) ? 
          { [prevField]: FieldValue.increment(increment), 
            [newField]: FieldValue.increment(increment), 
            total: FieldValue.increment(increment) } 
          : 
          { [prevField]: FieldValue.increment(increment), total: FieldValue.increment(increment) };
      } else {
        operations = { [prevField]: FieldValue.increment(-increment), [newField]: FieldValue.increment(increment) }
      }
      return transaction.set(ref, operations, { merge: true });
    });
  }).then(() => { 
    console.log(`Update multi/total aggregate (${increment}) transaction successfully committed!`);
    return true;
  }).catch(console.error);
}

async function generatePDF(id, change) {
  const form = (!change.after.exists) ? change.before.data() : change.after.data();
  const schoolApplicationRef = db.collection('schoolApplications').doc(`${id}`);
  const filename = `applications/${form.schoolName}-${id}.pdf`;
  const file = bucket.file(filename);

  if (!change.after.exists) {
    await file.delete();
    console.log(`Deleted ${filename} from Google Storage bucket.`);
    return;
  }

  const checkIfFileExists = await file.exists();
  if (checkIfFileExists[0]) {
    if (!form.downloadUrl) return generateDownloadUrl(schoolApplicationRef, form, file);
    return;
  }

  const doc = new PDFDocument;
  const bucketFileStream = file.createWriteStream();

  doc.pipe(bucketFileStream);
  
  doc.end();

  bucketFileStream.on('finish', () => {
    return generateDownloadUrl(schoolApplicationRef, form, file);
  });

  bucketFileStream.on('error', e => console.error);
}

function generateDownloadUrl(ref, form, file) {
  return file.getSignedUrl({action: 'read', expires: '03-17-2025'}).then(signedUrl => {
    if (signedUrl[0] === form.downloadUrl) {
      console.log('I have nothing to do!');
      return;
    }
    return ref.set({ downloadUrl: signedUrl[0] }, { merge: true });
  });
}