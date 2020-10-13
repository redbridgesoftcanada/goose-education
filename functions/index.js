const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.aggregates = require('./aggregates');
exports.deletes = require('./deletes');