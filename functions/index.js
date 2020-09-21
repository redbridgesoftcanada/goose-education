const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.aggregates = require('./aggregates');

exports.deleteAuthUser = functions.firestore
  .document('users/{userId}')
  .onDelete((snap, context) => {
    const uid = context.params.userId;
    return admin.auth().deleteUser(uid);
});