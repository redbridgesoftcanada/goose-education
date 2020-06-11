const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// C L O U D  F U N C T I O N S
// !change.before.exists = no existing document in collection BEFORE update = document created + add one to total field;
// !change.after.exists = no existing document in collection AFTER update = document deleted + subtract one from total field;

exports.aggregateTips = functions.firestore
  .document('tips/{tipId}')
  .onWrite((change, context) => {
    const tipRef = db.collection('aggregates').doc('tips');
    const aggregateTips = (!change.after.exists) ? aggregateTotalsTransaction(tipRef, -1) : aggregateTotalsTransaction(tipRef, 1);
    return aggregateTips;
});

exports.aggregateMessages = functions.firestore
  .document('messages/{messageId}')
  .onWrite((change, context) => {
    const messageRef = db.collection('aggregates').doc('messages');
    const aggregateMessages = (!change.after.exists) ? aggregateTotalsTransaction(messageRef, -1) : aggregateTotalsTransaction(messageRef, 1);
    return aggregateMessages;
});

exports.aggregateAirportRideApplications = functions.firestore
  .document('airportRideApplications/{airportRideApplicationId}')
  .onWrite((change, context) => {
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    const aggregateOtherApplications = (!change.after.exists) ? aggregateTotalsTransaction(otherApplicationsRef, -1, 'airportRidesTotal') : aggregateTotalsTransaction(otherApplicationsRef, 1, 'airportRidesTotal');
    return aggregateOtherApplications;
});

exports.aggregateHomestayApplications = functions.firestore
  .document('homestayApplications/{homestayApplicationId}')
  .onWrite((change, context) => {
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    const aggregateOtherApplications = (!change.after.exists) ? aggregateTotalsTransaction(otherApplicationsRef, -1, 'homestayTotal') : aggregateTotalsTransaction(otherApplicationsRef, 1, 'homestayTotal');
    return aggregateOtherApplications;
});

exports.aggregateSchoolApplications = functions.firestore
  .document('schoolApplications/{schoolApplicationId}')
  .onWrite((change, context) => {
    // aggregate (1): total number of applications by school;
    const schoolsRef = db.collection('aggregates').doc('schools');
    const school = change.after.get('schoolName');
    const aggregateSchools = (!change.after.exists) ? aggregateTotalsTransaction(schoolsRef, -1, school) : aggregateTotalsTransaction(schoolsRef, 1, school);

    // aggregate (2): total number of applications by application status;
    const applicationsRef = db.collection('aggregates').doc('schoolApplications');
    const aggregateApplications = configureAggregateHelpers(applicationsRef, 1, "status", change);

    return aggregateApplications && aggregateSchools;
});

exports.aggregateArticles = functions.firestore
  .document('articles/{articleId}')
  .onWrite((change, context) => {
    const articleRef = db.collection('aggregates').doc('articles');
    const aggregateArticles = configureAggregateHelpers(articleRef, 1, "tag", change);
    return aggregateArticles;
});

exports.aggregateAnnounces = functions.firestore
  .document('announcements/{announceId}')
  .onWrite((change, context) => {
    const announceRef = db.collection('aggregates').doc('announcements');
    const aggregateAnnounces = configureAggregateHelpers(announceRef, 1, "tag", change);
    return aggregateAnnounces;
});

// H E L P E R  F U N C T I O N S
const configureAggregateHelpers = (ref, increment, field, change) => {
  const newValue = change.after.get(field);
  const oldValue = change.before.get(field);

  if (newValue === oldValue) return null;

  let aggregateValues;
  if (!change.before.exists) {
    aggregateValues = aggregateTotalsTransaction(ref, increment, newValue);
  } else if (!change.after.exists) {
    aggregateValues = aggregateMultiTotalsTransaction(ref, -increment, oldValue, newValue);
  } else {
    aggregateValues = aggregateMultiTotalsTransaction(ref, increment, oldValue, newValue);
  }

  return aggregateValues;
}

const aggregateTotalsTransaction = (ref, increment, field) => {
  return db.runTransaction(transaction => {
    return transaction.get(ref)
    .then(doc => {
      if (!doc.exists) {
        console.log("Document does not exist!");
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
        console.log("Document does not exist!");
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
