const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// C L O U D  F U N C T I O N S

// !change.before.exists = no existing document in collection before update = new document created + add one to total field;
// !change.after.exists = no existing document in collection after update = document deleted + subtract one from total field;
// change.before.exists && change.after.exists = existing document in collection = do nothing;

exports.aggregateMessages = functions.firestore
  .document('messages/{messageId}')
  .onWrite((change, context) => {
    const aggregateMessageRef = db.collection('aggregates').doc('messages');
    if (!change.before.exists) {
      aggregateTotalsTransaction(aggregateMessageRef, 1);
        
    } else if (!change.after.exists) {
      aggregateTotalsTransaction(aggregateMessageRef, -1)

    } else if (change.before.exists && change.after.exists) {
      return;
    }
  return;
});

exports.aggregateAirportRideApplications = functions.firestore
  .document('airportRideApplications/{airportRideApplicationId}')
  .onWrite((change, context) => {
    const aggregateAirportRideApplicationsRef = db.collection('aggregates').doc('airportRideApplications');
    if (!change.before.exists) {
      aggregateTotalsTransaction(aggregateAirportRideApplicationsRef, 1);
        
    } else if (!change.after.exists) {
      aggregateTotalsTransaction(aggregateAirportRideApplicationsRef, -1)

    } else if (change.before.exists && change.after.exists) {
      return;
    }
  return;
});

exports.aggregateHomestayApplications = functions.firestore
  .document('homestayApplications/{homestayApplicationId}')
  .onWrite((change, context) => {
    const aggregateHomestayApplicationsRef = db.collection('aggregates').doc('homestayApplications');
    if (!change.before.exists) {
      aggregateTotalsTransaction(aggregateHomestayApplicationsRef, 1);
        
    } else if (!change.after.exists) {
      aggregateTotalsTransaction(aggregateHomestayApplicationsRef, -1)

    } else if (change.before.exists && change.after.exists) {
      return;
    }
  return;
});

exports.aggregateSchoolApplications = functions.firestore
  .document('schoolApplications/{schoolApplicationId}')
  .onWrite((change, context) => {
    const applicationStatus = change.after.exists ? change.after.data().status : null;

    const aggregateSchoolApplicationsRef = db.collection('aggregates').doc('schoolApplications');
    if (!change.before.exists) {
      aggregateTotalsTransaction(aggregateSchoolApplicationsRef, 1, applicationStatus);

    } else if (!change.after.exists) {
      aggregateTotalsTransaction(aggregateSchoolApplicationsRef, -1, applicationStatus)

    } else if (change.before.exists && change.after.exists) {
      return;
    }
  return;
});

// H E L P E R  F U N C T I O N S
const aggregateTotalsTransaction = (ref, increment, field) => {
  return db.runTransaction(transaction => {
    return transaction.get(ref).then(doc => {
      if (!doc.exists) {
        console.log("Document does not exist!");
      }

      if (field) {
        transaction.update(ref, {
          [field]: FieldValue.increment(increment), 
          total: FieldValue.increment(increment)
        });
      } else {
        transaction.update(ref, {total: FieldValue.increment(increment)});
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