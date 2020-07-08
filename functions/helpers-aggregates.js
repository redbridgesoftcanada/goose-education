const admin = require('firebase-admin');
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

module.exports.configureAggregation = function(ref, increment, field, change) {
  const onCreateEvent = !change.before.exists;
  const onDeleteEvent = !change.after.exists;

  const customField = field === 'customField';
  const otherApplicationTotals = field === 'airportRidesTotal' || field === 'homestayTotal';
  
  const newValue = change.after.get(field);
  const oldValue = change.before.get(field);
  
  let aggregation;
  switch(true) {
    case customField && onCreateEvent:
      aggregation = aggregateTotalsTransaction(ref, increment, change.after.get('schoolName'));
      break;

    case customField && onDeleteEvent:
      aggregation = aggregateTotalsTransaction(ref, -increment, change.before.get('schoolName'));
      break;
    
    case field && !customField: {
      switch(true) {
        case otherApplicationTotals && onCreateEvent: 
          aggregation = aggregateTotalsTransaction(ref, increment, field);
          break;

        case otherApplicationTotals && onDeleteEvent: 
          aggregation = aggregateTotalsTransaction(ref, -increment, field);
          break;
        
        case onCreateEvent:
          aggregation =  aggregateTotalsTransaction(ref, increment, newValue);
          break;

        case onDeleteEvent:
          aggregation = aggregateMultiTotalsTransaction(ref, -increment, oldValue, newValue);
          break;
        
        default:
          aggregation = aggregateMultiTotalsTransaction(ref, increment, oldValue, newValue);
      }
      break;
    }
    
    case !field && onCreateEvent: 
      aggregation = aggregateTotalsTransaction(ref, increment);
      break;
    
    case !field && onDeleteEvent:
      aggregation = aggregateTotalsTransaction(ref, -increment);
      break;

    default: 
      console.log('Missing configuration for provided aggregation condition.')
      return;
  }
  
  return aggregation;
}

function aggregateTotalsTransaction(ref, increment, field) {
  return db.runTransaction(transaction => {
    return transaction.get(ref)
    .then(doc => {
      if (!doc.exists) {
        console.log('Document does not exist!');
        return;
      }

      const operations = (field) ? 
        { [field]: FieldValue.increment(increment), total: FieldValue.increment(increment) } : 
        { total: FieldValue.increment(increment) };

      return transaction.set(ref, operations, { merge: true });
    });
  }).then(() => { 
    console.log(`Update single/total aggregate (${increment}) transaction successfully committed!`);
    return true;
  }).catch(console.error);
}

function aggregateMultiTotalsTransaction(ref, increment, prevField, newField) {
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
          { [prevField]: FieldValue.increment(increment), 
            total: FieldValue.increment(increment) };
      } else {
        operations = 
          { [prevField]: FieldValue.increment(-increment), 
            [newField]: FieldValue.increment(increment) }
      }

      return transaction.set(ref, operations, { merge: true });
    });
  }).then(() => { 
    console.log(`Update multi/total aggregate (${increment}) transaction successfully committed!`);
    return true;
  }).catch(console.error);
}
