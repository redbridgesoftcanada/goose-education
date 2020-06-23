const functions = require('firebase-functions');
const admin = require('firebase-admin');
const PDFDocument = require('pdfkit');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const bucket = admin.storage().bucket();
const FieldValue = admin.firestore.FieldValue;

// C L O U D  F U N C T I O N S
exports.aggregateTips = functions.firestore
  .document('tips/{tipId}')
  .onWrite((change, context) => {
    const tipRef = db.collection('aggregates').doc('tips');
    return configureAggregateHelpers(tipRef, 1, '', change);
});

exports.aggregateMessages = functions.firestore
  .document('messages/{messageId}')
  .onWrite((change, context) => {
    const messageRef = db.collection('aggregates').doc('messages');
    return configureAggregateHelpers(messageRef, 1, '', change);
});

exports.aggregateAirportRideApplications = functions.firestore
  .document('airportRideApplications/{airportRideApplicationId}')
  .onWrite((change, context) => {
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    return configureAggregateHelpers(otherApplicationsRef, 1, 'airportRidesTotal', change);
});

exports.aggregateHomestayApplications = functions.firestore
  .document('homestayApplications/{homestayApplicationId}')
  .onWrite(async (change, context) => {
    // A G G R E G A T E (total number of applications);
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    const aggregateTotalHomestays = configureAggregateHelpers(otherApplicationsRef, 1, 'homestayTotal', change);

    // O T H E R (create PDF with downloadable link of homestay application);
    const applicationId = context.params.homestayApplicationId;
    const generateApplicationPDF = configurePDFGenerator('homestay', applicationId, change);

    await Promise.all([aggregateTotalHomestays, generateApplicationPDF])
    .catch(console.error);
});

exports.aggregateSchoolApplications = functions.firestore
  .document('schoolApplications/{schoolApplicationId}')
  .onWrite(async (change, context) => {
    // A G G R E G A T E (total number of applications by school);
    const schoolsRef = db.collection('aggregates').doc('schools');
    const aggregateSchools = configureAggregateHelpers(schoolsRef, 1, 'customField', change);

    // A G G R E G A T E (total number of applications by status); 
    const applicationsRef = db.collection('aggregates').doc('schoolApplications');
    const aggregateApplications = configureAggregateHelpers(applicationsRef, 1, 'status', change);

    // O T H E R (create PDF with downloadable link of school application);
    const applicationId = context.params.schoolApplicationId;
    const generateApplicationPDF = configurePDFGenerator('school', applicationId, change);

    await Promise.all([aggregateSchools, aggregateApplications, generateApplicationPDF])
    .catch(console.error);
});

exports.aggregateArticles = functions.firestore
  .document('articles/{articleId}')
  .onWrite((change, context) => {
    const articleRef = db.collection('aggregates').doc('articles');
    return configureAggregateHelpers(articleRef, 1, 'tag', change);
});

exports.aggregateAnnounces = functions.firestore
  .document('announcements/{announceId}')
  .onWrite((change, context) => {
    const announceRef = db.collection('aggregates').doc('announcements');
    return configureAggregateHelpers(announceRef, 1, 'tag', change);
});

// H E L P E R  F U N C T I O N S
// !change.before.exists = no existing document in collection BEFORE update = document created + add one to total field;
// !change.after.exists = no existing document in collection AFTER update = document deleted + subtract one from total field;

const configureAggregateHelpers = (ref, increment, field, change) => {
  let aggregateValues;
  switch(true) {
    case field === 'customField': 
      if (!change.before.exists) aggregateValues = aggregateTotalsTransaction(ref, increment, change.after.get('schoolName'));
      if (!change.after.exists) aggregateValues = aggregateTotalsTransaction(ref, -increment, change.before.get('schoolName'));
      break;
    
    case field !== '' && field !== 'customField': {
      const newValue = change.after.get(field);
      const oldValue = change.before.get(field);
      const checkNestedTotals = field === 'airportRidesTotal' || field === 'homestayTotal';

      switch(true) {
        case checkNestedTotals: 
          aggregateValues = (!change.after.exists) ? aggregateTotalsTransaction(ref, -increment, field) : aggregateTotalsTransaction(ref, increment, field);
          break;
        
        case !change.before.exists:
          aggregateValues =  aggregateTotalsTransaction(ref, increment, newValue);
          break;

        case !change.after.exists:
          aggregateValues = aggregateMultiTotalsTransaction(ref, -increment, oldValue, newValue);
          break;
        
        default:
          aggregateValues = aggregateMultiTotalsTransaction(ref, increment, oldValue, newValue);
      }
      break;
    }
    
    default: 
      aggregateValues = (!change.after.exists) ? aggregateTotalsTransaction(ref, -increment) : aggregateTotalsTransaction(ref, increment);
  }
  return aggregateValues;
}

const aggregateTotalsTransaction = (ref, increment, field) => {
  return db.runTransaction(transaction => {
    return transaction.get(ref)
    .then(doc => {
      if (!doc.exists) {
        console.log('Document does not exist!');
        return;
      }
      const operations = (field) ? { [field]: FieldValue.increment(increment), total: FieldValue.increment(increment) } : { total: FieldValue.increment(increment) };
      return transaction.set(ref, operations, { merge: true });
    });
  }).then(() => { 
    console.log(`Update single/total aggregate (${increment}) transaction successfully committed!`);
    return true;
  }).catch(console.error);
}

const aggregateMultiTotalsTransaction = (ref, increment, prevField, newField) => {
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
          { [prevField]: FieldValue.increment(increment), total: FieldValue.increment(increment) };
      } else {
        operations = { [prevField]: FieldValue.increment(-increment), [newField]: FieldValue.increment(increment) }
      }
      return transaction.set(ref, operations, { merge: true });
    });
  }).then(() => { 
    console.log(`Update multi/total aggregate (${increment}) transaction successfully committed!`);
    return true;
  }).catch(console.error);
}

async function configurePDFGenerator(type, id, change) {
  const form = (!change.after.exists) ? change.before.data() : change.after.data();

  let ref, filename, file;
  if (type === 'school') {
    ref = db.collection('schoolApplications').doc(`${id}`);
    filename = `applications/${form.schoolName}-${id}.pdf`;
    file = bucket.file(filename);
  }
  
  if (type === 'homestay') {
    ref = db.collection('homestayApplications').doc(`${id}`);
    filename = `applications/homestay-${id}.pdf`;
    file = bucket.file(filename);
  }

  if (!change.after.exists) {
    await file.delete();
    console.log(`Deleted ${filename} from Google Storage bucket.`);
    return;
  }

  const checkIfFileExists = await file.exists();
  if (checkIfFileExists[0]) {
    if (!form.downloadUrl) return generateDownloadUrl(ref, form, file);
    return;
  }

  const doc = new PDFDocument;
  const bucketFileStream = file.createWriteStream();

  doc.pipe(bucketFileStream);
  
  // Header
  doc.image('./gooseedu-logo.png', 60, 45, {fit: [100, 100]});
  doc.font('Helvetica-Bold').fontSize(16).text('Agency Name: Goose Education', 282, 95);

  // Personal Information
  doc.roundedRect(72, 150, 451, 210, 2).stroke();
  doc.roundedRect(72, 150, 451, 30, 2).stroke();
  doc.font('Helvetica-Bold').fontSize(16).text('PERSONAL INFORMATION', 80, 160);
  doc.font('Helvetica').fontSize(12);
  doc.text(`Last Name: ${form.lastName}`, 80, 190);
  doc.text(`First Name: ${form.firstName}`, 330, 190);
  doc.moveTo(72, 210).lineTo(524, 210).stroke();
  doc.moveTo(315, 180).lineTo(315, 240).stroke();
  doc.text('Date of Birth ', 80, 220, {continued: true}).fontSize(7).text('(MM/DD/YYYY)', 80, 224, {continued: true}).fontSize(12).text(`: ${form.birthDate}`, 80, 220);
  doc.text('Gender:', 330, 220);
  (form.gender === 'Male') ? doc.rect(380, 220, 8, 8).fill().stroke() : doc.rect(380, 220, 8, 8).stroke();
  (form.gender === 'Female') ? doc.rect(440, 220, 8, 8).fill().stroke() : doc.rect(440, 220, 8, 8).stroke();
  doc.text('M', 405, 220);
  doc.text('F', 455, 220);
  doc.moveTo(72, 240).lineTo(524, 240).stroke();
  doc.text(`Address: ${form.address}`, 80, 250);
  doc.moveTo(72, 270).lineTo(524, 270).stroke();
  doc.text(`Telephone: ${form.address}`, 80, 280);
  doc.moveTo(72, 300).lineTo(524, 300).stroke();
  doc.text(`Email: ${form.email}`, 80, 310);
  doc.moveTo(72, 330).lineTo(524, 330).stroke();
  doc.moveTo(315, 330).lineTo(315, 360).stroke();
  doc.text(`Emergency Contact: ${form.emergencyContactNumber}`, 80, 340);
  doc.text(`Relationship: ${form.emergencyContactRelation}`, 330, 340);

  // Form Specific Sections
  (type === 'school') ? generateSchoolSections(doc, form) : 
  (type === 'homestay') ? generateHomestaySections(doc, form) : null;

  // Footer
  doc.fontSize(10);
  doc.text('Goose Education | 487 Suji-ro, Suji-gu, Yongin-si, Gyeonggi-do, Korea', 150, 685);
  doc.text('Tel: +1.010.5344.6642 | Email: goose.education@gmail.com | Website: ', 90, 697, {continued: true}).text('www.gooseedu.com', {link:'http://www.gooseedu.com/'});

  doc.end();

  bucketFileStream.on('finish', () => {
    return generateDownloadUrl(ref, form, file);
  });

  bucketFileStream.on('error', e => console.error);
}

function generateSchoolSections(doc, form) {
  // Document Title
  doc.font('Helvetica-Bold').fontSize(20).text('APPLICATION FORM', 300, 72, {characterSpacing: 2});

  // Program Information
  doc.font('Helvetica-Bold').text(`SCHOOL NAME: ${form.schoolName}`, 72, 380);
  doc.roundedRect(72, 400, 451, 120, 2).stroke();
  doc.roundedRect(72, 400, 451, 30, 2).stroke();
  doc.font('Helvetica-Bold').fontSize(16).text('PROGRAM INFORMATION', 80, 410);
  doc.font('Helvetica').fontSize(12);
  doc.text(`Program Name: ${form.programName}`, 80, 440);
  doc.moveTo(72, 460).lineTo(524, 460).stroke();
  doc.text(`Program Duration: ${form.programDuration}`, 80, 470);
  doc.moveTo(72, 490).lineTo(524, 490).stroke();
  doc.text(`Start Date: ${form.startDate}`, 80, 500);

  // Arrival Date & Insurance
  doc.font('Helvetica-Bold').text('ARRIVAL DATE ', 72, 545).fontSize(7).text('(MM/DD/YYYY)', 160, 549, {continued: true}).fontSize(12).text(`: ${form.arrivalDate}`, 165, 545);
  doc.roundedRect(72, 565, 451, 50, 2).stroke();
  doc.roundedRect(72, 565, 451, 30, 2).stroke();
  doc.font('Helvetica-Bold').fontSize(16).text('INSURANCE', 80, 575);
  doc.font('Helvetica').fontSize(12);
  (form.insurance) ? doc.rect(80, 600, 8, 8).fill().stroke() : doc.rect(80, 600, 8, 8).stroke();
  doc.text('Yes', 100, 600);
  (!form.insurance) ? doc.rect(200, 600, 8, 8).fill().stroke() : doc.rect(200, 600, 8, 8).stroke();
  doc.text('No', 220, 600);
}

function generateHomestaySections(doc, form) {
  // Document Title
  doc.font('Helvetica-Bold').fontSize(20).text('HOMESTAY FORM', 330, 72, {characterSpacing: 2});

  // Accommodation Information
  doc.roundedRect(72, 400, 451, 60, 2).stroke();
  doc.moveTo(72, 430).lineTo(523, 430).stroke();
  doc.font('Helvetica-Bold').fontSize(16).text('ACCOMMODATION', 80, 410);
  doc.font('Helvetica').fontSize(12);
  doc.moveTo(315, 430).lineTo(315, 460).stroke();
  doc.text(`Start Date: ${form.homestayStartDate}`, 80, 440);
  doc.text(`End Date: ${form.homestayEndDate}`, 330, 440);

  // Flight Information
  const checkForFlightInfo = form.arrivalFlightName && form.arrivalFlightDate && form.arrivalFlightTime;

  doc.font('Helvetica-Bold').text('Flight Information Provided:', 72, 490);
  if (!checkForFlightInfo) {
    doc.rect(380, 490, 8, 8).stroke();
    doc.rect(480, 490, 8, 8).fill().stroke();
  } else {
    doc.rect(380, 490, 8, 8).fill().stroke();
    doc.rect(480, 490, 8, 8).stroke();
  }
  doc.text('Yes', 400, 490);
  doc.text('No', 500, 490);


  doc.roundedRect(72, 505, 451, 60, 2).stroke();
  doc.moveTo(72, 535).lineTo(523, 535).stroke();
  doc.fontSize(16).text('FLIGHT INFORMATION', 80, 515);
  doc.font('Helvetica').fontSize(12);
  doc.text(`Name: ${(form.arrivalFlightName) ? form.arrivalFlightName : 'N/A'}`, 80, 545);
  doc.moveTo(230, 535).lineTo(230, 565).stroke();
  doc.text(`Date: ${(form.arrivalFlightDate) ? form.arrivalFlightDate : 'N/A'}`, 240, 545);
  doc.moveTo(380, 535).lineTo(380, 565).stroke();
  doc.text(`Time: ${(form.arrivalFlightTime) ? form.arrivalFlightTime : 'N/A'}`, 390, 545);
}

function generateDownloadUrl(ref, form, file) {
  return file.getSignedUrl({action: 'read', expires: '03-17-2025'}).then(signedUrl => {
    if (signedUrl[0] === form.downloadUrl) {
      console.log('Nothing to do - existing download URL is the same as the newly generated one!');
      return;
    }
    return ref.set({ downloadUrl: signedUrl[0] }, { merge: true });
  });
}