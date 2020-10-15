const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();
const bucket = admin.storage().bucket();

exports.cleanupUserDelete = functions.auth.user()
  .onDelete(async user => await db.collection('users').doc(user.uid).delete());

exports.cleanupUserContent = functions.firestore
  .document('users/{userID}')
  .onDelete(async (snap, context) => {
    const uid = context.params.userID;
    const listOfDeletions = [];
    
    // authentication account
    const authUserExists = await admin.auth().getUser(uid);
    if (authUserExists) listOfDeletions.push(await admin.auth().deleteUser(uid));

    // school application documents
    const querySchoolAppls = await db.collection('schoolApplications').where('authorID', '==', uid);
    const [schoolFiles] = await bucket.getFiles({prefix: '/schools', delimiter: '/'});
    listOfDeletions.push(deleteFirestoreDocs(querySchoolAppls));
    listOfDeletions.push(deleteStorageFiles(schoolFiles, uid));

    // homestay application documents
    const queryHomestayAppls = await db.collection('homestayApplications').where('authorID', '==', uid);
    const [homestayFiles] = await bucket.getFiles({prefix: '/homestays', delimiter: '/'});
    listOfDeletions.push(deleteFirestoreDocs(queryHomestayAppls));
    listOfDeletions.push(deleteStorageFiles(homestayFiles, uid));

    // airport application documents
    const queryAirportAppls = await db.collection('airportRideApplications').where('authorID', '==', uid);
    const [airportFiles] = await bucket.getFiles({prefix: '/airportRides', delimiter: '/'});
    listOfDeletions.push(deleteFirestoreDocs(queryAirportAppls));
    listOfDeletions.push(deleteStorageFiles(airportFiles, uid));
    
    return await Promise.all(listOfDeletions);
});

function deleteFirestoreDocs(query) {
  const batch = db.batch();
  query.get().then(async snapshot => {
    if (snapshot.empty) {
      console.log('No matching document(s) found from Firestore DB.');
      return;
    }
    snapshot.forEach(doc => batch.delete(doc.ref));
    return batch.commit().catch(console.error);
  }).catch(console.error);
}

function deleteStorageFiles(files, uid) {
  if (!files.length) {
    console.log("No matching storage file(s) found in Firebase Storage");
    return;
  }
  files.forEach(async file => {
    const [metadata] = await bucket.file(file.name).getMetadata();
    if (metadata.metadata.owner === uid) {
      await bucket.file(file.name).delete();
      console.log(`Deleted ${file.name} from Firebase Storage.`);
    }
  });
}