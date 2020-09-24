async function onDelete(id, uploads, firebase, toggleDeleteConfirm, setSnackbarMessage) {
  const deletePromises = [];

  if (uploads) {
    const deleteStorageResource = firebase.refFromUrl(uploads).delete();
    deletePromises.push(deleteStorageResource);
  }

  const deleteDoc =  firebase.deleteMessage(id);
  deletePromises.push(deleteDoc);

  try {
    await Promise.all(deletePromises);
    setSnackbarMessage('Successfully deleted!');
    toggleDeleteConfirm();
  } catch (error) {
    console.log(error.message)
  }
}

export { onDelete }