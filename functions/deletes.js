const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();
const bucket = admin.storage().bucket();

// remove all application docs and storage files for deleted user;
exports.cleanupUserDelete = functions.auth.user()
  .onDelete(async user => {
    const uid = user.uid;

    // user document
    const deleteUserDoc = await db.collection('users').doc(uid).delete();

    // school application documents
    const querySchoolAppls = await db.collection('schoolApplications').where('authorID', '==', uid);
    const [schoolFiles] = await bucket.getFiles({prefix: '/schools', delimiter: '/'}).catch(console.error);
    const deleteSchoolDocs = deleteFirestoreDocs(querySchoolAppls);
    const deleteSchoolFiles = deleteStorageFiles(schoolFiles, uid);

    // homestay application documents
    const queryHomestayAppls = await db.collection('homestayApplications').where('authorID', '==', uid);
    const [homestayFiles] = await bucket.getFiles({prefix: '/homestays', delimiter: '/'}).catch(console.error);
    const deleteHomestayDocs = deleteFirestoreDocs(queryHomestayAppls);
    const deleteHomestayFiles = deleteStorageFiles(homestayFiles, uid);

    // airport application documents
    const queryAirportAppls = await db.collection('airportRideApplications').where('authorID', '==', uid);
    const [airportFiles] = await bucket.getFiles({prefix: '/airportRides', delimiter: '/'}).catch(console.error);
    const deleteAirportDocs = deleteFirestoreDocs(queryAirportAppls);
    const deleteAirportFiles = deleteStorageFiles(airportFiles, uid);
    
    return await Promise.all([deleteUserDoc, deleteSchoolDocs, deleteHomestayDocs, deleteAirportDocs, deleteSchoolFiles, deleteHomestayFiles, deleteAirportFiles]);
});

function deleteFirestoreDocs(query) {
  const batch = db.batch();
  query.get().then(async snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents in Firestore DB found for this user id.');
      return;
    }
    snapshot.forEach(doc => batch.delete(doc.ref));
    return batch.commit().catch(console.error);
  }).catch(console.error);
}

function deleteStorageFiles(files, uid) {
  files.forEach(async file => {
    const [metadata] = await bucket.file(file.name).getMetadata();
    
    if (metadata.metadata.owner === uid) {
      await bucket.file(file.name).delete();
      console.log(`Deleted ${file.name} from Firebase Storage.`);
    }

    console.log('No matching storage file found for this uid.')
    return;
  });
}