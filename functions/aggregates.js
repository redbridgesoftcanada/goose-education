const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const { configureAggregation } = require('./helpers-aggregates');
const { configurePDFGenerator } = require('./helpers-pdf');

exports.totalTips = functions.firestore
  .document('tips/{tipId}')
  .onWrite((change, context) => {
    const tipRef = db.collection('aggregates').doc('tips');
    return configureAggregation(tipRef, 1, '', change);
});

exports.totalMessages = functions.firestore
  .document('messages/{messageId}')
  .onWrite((change, context) => {
    const messageRef = db.collection('aggregates').doc('messages');
    return configureAggregation(messageRef, 1, '', change);
});

exports.totalAirportRideApplications = functions.firestore
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

exports.totalHomestayApplications = functions.firestore
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

exports.totalSchoolApplications = functions.firestore
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

exports.totalArticles = functions.firestore
  .document('articles/{articleId}')
  .onWrite((change, context) => {
    const articleRef = db.collection('aggregates').doc('articles');
    return configureAggregation(articleRef, 1, 'tag', change);
});

exports.totalAnnounces = functions.firestore
  .document('announcements/{announceId}')
  .onWrite((change, context) => {
    const announceRef = db.collection('aggregates').doc('announcements');
    return configureAggregation(announceRef, 1, 'tag', change);
});