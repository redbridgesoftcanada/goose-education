const admin = require('firebase-admin');
const db = admin.firestore();
const bucket = admin.storage().bucket();
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');

module.exports.configurePDFGenerator = async function(type, id, change) {
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
  const metadata = { metadata: { owner: form.authorID } }
  const bucketFileStream = file.createWriteStream({metadata: metadata});

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
  doc.text('Date of Birth ', 80, 220, {continued: true}).fontSize(7).text('(MM/DD/YYYY)', 80, 224, {continued: true}).fontSize(12).text(`: ${format(form.birthDate.toDate(), 'P')}`, 80, 220);
  doc.text('Gender:', 330, 220);
  (form.gender === 'male') ? doc.rect(380, 220, 8, 8).fill().stroke() : doc.rect(380, 220, 8, 8).stroke();
  (form.gender === 'female') ? doc.rect(440, 220, 8, 8).fill().stroke() : doc.rect(440, 220, 8, 8).stroke();
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
  doc.text(`Program Duration (Number of Weeks): ${form.programDuration}`, 80, 470);
  doc.moveTo(72, 490).lineTo(524, 490).stroke();
  doc.text(`Start Date: ${format(form.programStartDate.toDate(), 'P')}`, 80, 500);

  // Arrival Date & Insurance
  doc.font('Helvetica-Bold').text('ARRIVAL DATE ', 72, 545).fontSize(7).text('(MM/DD/YYYY)', 160, 549, {continued: true}).fontSize(12).text(`: ${format(form.arrivalFlightDate.toDate(), 'P')}`, 165, 545);
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
  doc.text(`Start Date: ${format(form.homestayStartDate.toDate(), 'P')}`, 80, 440);
  doc.text(`End Date: ${format(form.homestayEndDate.toDate(), 'P')}`, 330, 440);

  // Flight Information
  const checkForFlightInfo = form.arrivalFlightName && form.arrivalFlightDate;

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
  doc.text(`Date: ${(form.arrivalFlightDate) ? format(form.arrivalFlightDate.toDate(), 'Pp') : 'N/A'}`, 240, 545);
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
  doc.text(`Date: ${format(form.arrivalFlightDate.toDate(), 'Pp')}`, 240, 440);

  doc.roundedRect(72, 490, 451, 60, 2).stroke();
  doc.moveTo(72, 520).lineTo(523, 520).stroke();
  doc.font('Helvetica-Bold').fontSize(16).text('DEPARTURE FLIGHT INFORMATION', 80, 500);
  doc.font('Helvetica').fontSize(12);
  doc.text(`Name: ${form.departureFlightName}`, 80, 530);
  doc.moveTo(230, 520).lineTo(230, 550).stroke();
  doc.text(`Date: ${format(form.departureFlightDate.toDate(), 'Pp')}`, 240, 530);

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
  doc.text(`Start Date: ${(form.homestayStartDate) ? format(form.homestayStartDate.toDate(), 'P') : 'N/A'}`, 80, 640);
  doc.text(`End Date: ${(form.homestayEndDate) ? format(form.homestayEndDate.toDate(), 'P') : 'N/A'}`, 330, 640);
}