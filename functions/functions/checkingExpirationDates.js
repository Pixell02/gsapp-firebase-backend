const functions = require("firebase-functions");
const moment = require('moment');
const admin = require('firebase-admin');



exports.checkingExpirationDates = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  try {
    const currentDate = moment().format('MM-DD-YYYY');
    const expiredDocuments = [];

    const snapshot = await admin.firestore().collection('user').get();

    snapshot.forEach(async (doc) => {
      const userData = doc.data();
      if (userData.hasOwnProperty('expireDate')) {
        const expireDate = userData.expireDate;
        console.log(expireDate, currentDate)
        if (expireDate < currentDate) {
          console.log(doc)
          expiredDocuments.push(doc);
        }
      }
    });
    

    expiredDocuments.forEach(async (doc) => {
    console.log(doc)
      await doc.ref.update({ 
        expireDate: "",
        license: "no-license"
      }); 
    });

    return null;
  } catch (error) {
    console.error('Błąd podczas sprawdzania daty wygaśnięcia:', error);
    return null;
  }
})