async function onDelete(uploads, firebase, deleteDoc, deleteConfirmToggle, setSnackbarMessage) {
  const deletePromises = [];

  if (uploads.length) {
    const deleteStorageResource = firebase.refFromUrl(uploads).delete();
    deletePromises.push(deleteStorageResource);
  }

  deletePromises.push(deleteDoc);

  try {
    await Promise.all(deletePromises);
    setSnackbarMessage('Successfully deleted!');
    deleteConfirmToggle();
  } catch (error) {
    console.log(error.message)
  }
}

export { onDelete }