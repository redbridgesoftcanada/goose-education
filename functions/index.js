const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// H E L P E R  F U N C T I O N S
const aggregateTransaction = (ref, action) => {
  return db.runTransaction(transaction => {
    return transaction.get(ref).then(doc => {
      if (!doc.exists) {
        console.log("Document does not exist!");
      }
      transaction.update(ref, {total: FieldValue.increment(action)});
      return true;
    });
  })
  .then(() => { 
    console.log(`Update (${action}) transaction successfully committed!`);
    return true;
  })
  .catch(error => { 
    console.log(`Update (${action}) transaction failed: `, error);
    return;
  });
}

// C L O U D  F U N C T I O N S
exports.aggregateTotalMessages = functions.firestore
  .document('messages/{messageId}')
  .onWrite((change, context) => {
    const aggregateMessageRef = db.collection('aggregates').doc('messages');
    if (!change.before.exists) {
        // New document Created : add one to total
        aggregateTransaction(aggregateMessageRef, 1);
        
    } else if (!change.after.exists) {
        // Deleting document : subtract one from total
        aggregateTransaction(aggregateMessageRef, -1)

    } else if (change.before.exists && change.after.exists) {
        // Updating existing document : Do nothing
        return;
    }
  return;
});
