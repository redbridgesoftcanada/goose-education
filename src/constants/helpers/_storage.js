function checkStorageDelete(firebase, collection, doc) {
  const { id, upload } = doc;

  let docRef;  
  switch(collection) {    
    case 'schools': docRef = firebase.deleteSchool(id);
    case 'applications': docRef = firebase.deleteSchoolApplication(id);
    case 'homestays': docRef = firebase.deleteHomestayApplication(id);
    case 'airport_rides': docRef = firebase.deleteAirportRideApplication(id);
    case 'tips': docRef = firebase.deleteTip(id);
    case 'articles': docRef = firebase.deleteArticle(id);
    case 'announcements': docRef = firebase.deleteAnnouncement(id);
    case 'messages': docRef = firebase.deleteMessage(id);  
  }

  const deletePromises = [docRef];
  if (upload) deletePromises.push(firebase.refFromUrl(upload).delete());

  Promise.all(deletePromises);
}


function onDelete(collection, selected, firebase, closeDeleteConfirm, setSnackbarMessage) {
  const { id, upload } = selected;
  
  let docRef;  
  switch(collection) {    
    case 'schools': docRef = firebase.deleteSchool(id);
    case 'applications': docRef = firebase.deleteSchoolApplication(id);
    case 'homestays': docRef = firebase.deleteHomestayApplication(id);
    case 'airport_rides': docRef = firebase.deleteAirportRideApplication(id);
    case 'tips': docRef = firebase.deleteTip(id);
    case 'articles': docRef = firebase.deleteArticle(id);
    case 'announcements': docRef = firebase.deleteAnnouncement(id);
    case 'messages': docRef = firebase.deleteMessage(id);  
  }

  const deletePromises = [ docRef ];
  if (upload) deletePromises.push(firebase.refFromUrl(upload).delete());

  Promise.all(deletePromises)
  .then(() => {
    setSnackbarMessage('Successfully deleted! Please refresh to see changes.');
    closeDeleteConfirm();
  })
  .catch(err => setSnackbarMessage('Something went wrong! Unable to delete document.'));
}

export { checkStorageDelete, onDelete }