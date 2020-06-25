const functions = require('firebase-functions');
const admin = require('firebase-admin');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const bucket = admin.storage().bucket();
const FieldValue = admin.firestore.FieldValue;

// C L O U D  F U N C T I O N S
exports.aggregateTips = functions.firestore
  .document('tips/{tipId}')
  .onWrite((change, context) => {
    const tipRef = db.collection('aggregates').doc('tips');
    return configureAggregation(tipRef, 1, '', change);
});

exports.aggregateMessages = functions.firestore
  .document('messages/{messageId}')
  .onWrite((change, context) => {
    const messageRef = db.collection('aggregates').doc('messages');
    return configureAggregation(messageRef, 1, '', change);
});

exports.aggregateAirportRideApplications = functions.firestore
  .document('airportRideApplications/{airportRideApplicationId}')
  .onWrite(async (change, context) => {
    // A G G R E G A T E (total number of applications);
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    const aggregateTotalAirportRides = configureAggregation(otherApplicationsRef, 1, 'airportRidesTotal', change);

    // O T H E R (create PDF with downloadable link of homestay application);
    const applicationId = context.params.airportRideApplicationId;
    const generateApplicationPDF = configurePDFGenerator('airport', applicationId, change);

    await Promise.all([aggregateTotalAirportRides, generateApplicationPDF])
    .catch(console.error);
});

exports.aggregateHomestayApplications = functions.firestore
  .document('homestayApplications/{homestayApplicationId}')
  .onWrite(async (change, context) => {
    // A G G R E G A T E (total number of applications);
    const otherApplicationsRef = db.collection('aggregates').doc('otherApplications');
    const aggregateTotalHomestays = configureAggregation(otherApplicationsRef, 1, 'homestayTotal', change);

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
    const aggregateSchools = configureAggregation(schoolsRef, 1, 'customField', change);

    // A G G R E G A T E (total number of applications by status); 
    const applicationsRef = db.collection('aggregates').doc('schoolApplications');
    const aggregateApplications = configureAggregation(applicationsRef, 1, 'status', change);

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
    return configureAggregation(articleRef, 1, 'tag', change);
});

exports.aggregateAnnounces = functions.firestore
  .document('announcements/{announceId}')
  .onWrite((change, context) => {
    const announceRef = db.collection('aggregates').doc('announcements');
    return configureAggregation(announceRef, 1, 'tag', change);
});

// H E L P E R  F U N C T I O N S
// !change.before.exists = no existing document in collection BEFORE update = document created + add one to total field;
// !change.after.exists = no existing document in collection AFTER update = document deleted + subtract one from total field;

const configureAggregation = (ref, increment, field, change) => {
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

const aggregateTotalsTransaction = (ref, increment, field) => {
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

async function configurePDFGenerator(type, id, change) {
  const onCreateEvent = !change.before.exists;
  const onDeleteEvent = !change.after.exists;
  const form = (onDeleteEvent) ? change.before.data() : change.after.data();

  let ref, filename, file;
  if (type === 'school') {
    ref = db.collection('schoolApplications').doc(`${id}`);
    filename = `applications/schools/${form.schoolName}-${id}.pdf`;
    file = bucket.file(filename);
  } 
  else if (type === 'homestay') {
    ref = db.collection('homestayApplications').doc(`${id}`);
    filename = `applications/homestays/${id}-${form.authorID}.pdf`;
    file = bucket.file(filename);
  }
  else if (type === 'airport') {
    ref = db.collection('airportRideApplications').doc(`${id}`);
    filename = `applications/airportRides/${id}-${form.authorID}.pdf`;
    file = bucket.file(filename);
  }

  if (onDeleteEvent) {
    await file.delete();
    console.log(`Deleted ${filename} from Google Storage bucket.`);
    return;
  }
  
  const checkIfFileExists = await file.exists();
  if (checkIfFileExists[0]) {
    if (!form.downloadUrl) return generateDownloadUrl(ref, form, file);
    return;
  } 
  else if (!checkIfFileExists[0] && !onCreateEvent) {
    if (!form.downloadUrl) return;
    return ref.update({ downloadUrl: '' });
  }

  generatePDF(type, ref, file, form)
}

function generatePDF(type, ref, file, form){
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
  doc.text(`Telephone: ${form.phoneNumber}`, 80, 280);
  doc.moveTo(72, 300).lineTo(524, 300).stroke();
  doc.text(`Email: ${form.email}`, 80, 310);
  doc.moveTo(72, 330).lineTo(524, 330).stroke();
  doc.moveTo(315, 330).lineTo(315, 360).stroke();
  doc.text(`Emergency Contact: ${form.emergencyContactNumber}`, 80, 340);
  doc.text(`Relationship: ${form.emergencyContactRelation}`, 330, 340);

  // Form Specific Sections
  (type === 'school') && generateSchoolSections(doc, form); 
  (type === 'homestay') && generateHomestaySections(doc, form); 
  (type === 'airport') && generateAirportSections(doc, form);

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

function generateDownloadUrl(ref, form, file) {
  return file.getSignedUrl({action: 'read', expires: '03-17-2025'}).then(signedUrl => {
    if (signedUrl[0] === form.downloadUrl) {
      console.log('Nothing to do - existing download URL is the same as the newly generated one!');
      return;
    }
    return ref.set({ downloadUrl: signedUrl[0] }, { merge: true });
  });
}

function generateSchoolSections(doc, form) {
  // Document Title
  doc.font('Helvetica-Bold').fontSize(20).text('APPLICATION FORM', 300, 72, {characterSpacing: 2});

  // Program Information
  doc.font('Helvetica-Bold').fontSize(12).text(`SCHOOL NAME: ${form.schoolName}`, 72, 380);
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
  doc.text(`Time: ${(form.arrivalFlightTime) ? format(form.arrivalFlightTime, 'p') : 'N/A'}`, 390, 545);
}

function generateAirportSections(doc, form) {
  // Document Title
  doc.font('Helvetica-Bold').fontSize(20).text('AIRPORT RIDE FORM', 290, 72, {characterSpacing: 2});
  
  // Flight Information
  doc.roundedRect(72, 400, 451, 60, 2).stroke();
  doc.moveTo(72, 430).lineTo(523, 430).stroke();
  doc.font('Helvetica-Bold').fontSize(16).text('ARRIVAL FLIGHT INFORMATION', 80, 410);
  doc.font('Helvetica').fontSize(12);
  doc.text(`Name: ${form.arrivalFlightName}`, 80, 440);
  doc.moveTo(230, 430).lineTo(230, 460).stroke();
  doc.text(`Date: ${form.arrivalFlightDate}`, 240, 440);
  doc.moveTo(380, 430).lineTo(380, 460).stroke();
  doc.text(`Time: ${format(form.arrivalFlightTime, 'p')}`, 390, 440);

  doc.roundedRect(72, 490, 451, 60, 2).stroke();
  doc.moveTo(72, 520).lineTo(523, 520).stroke();
  doc.font('Helvetica-Bold').fontSize(16).text('DEPARTURE FLIGHT INFORMATION', 80, 500);
  doc.font('Helvetica').fontSize(12);
  doc.text(`Name: ${form.departureFlightName}`, 80, 530);
  doc.moveTo(230, 520).lineTo(230, 550).stroke();
  doc.text(`Date: ${form.departureFlightDate}`, 240, 530);
  doc.moveTo(380, 520).lineTo(380, 550).stroke();
  doc.text(`Time: ${format(form.departureFlightTime, 'p')}`, 390, 530);

  // Homestay Information
  const checkForHomestayInfo = form.homestayStartDate && form.homestayEndDate;

  doc.font('Helvetica-Bold').text('Homestay Information Provided:', 72, 580);
  if (!checkForHomestayInfo) {
    doc.rect(380, 580, 8, 8).stroke();
    doc.rect(480, 580, 8, 8).fill().stroke();
  } else {
    doc.rect(380, 580, 8, 8).fill().stroke();
    doc.rect(480, 580, 8, 8).stroke();
  }
  doc.text('Yes', 400, 580);
  doc.text('No', 500, 580);

  doc.roundedRect(72, 600, 451, 60, 2).stroke();
  doc.moveTo(72, 630).lineTo(523, 630).stroke();
  doc.font('Helvetica-Bold').fontSize(16).text('ACCOMMODATION', 80, 610);
  doc.font('Helvetica').fontSize(12);
  doc.moveTo(315, 630).lineTo(315, 660).stroke();
  doc.text(`Start Date: ${(form.homestayStartDate) ? form.homestayStartDate : 'N/A'}`, 80, 640);
  doc.text(`End Date: ${(form.homestayEndDate) ? form.homestayEndDate : 'N/A'}`, 330, 640);
}
