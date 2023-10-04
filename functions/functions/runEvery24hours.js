const functions = require("firebase-functions");
const moment = require('moment');
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const admin = require('firebase-admin');
const transporter = require("./mail/transporter");

    

exports.runEvery24hours = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  try {
    const currentDate = moment().format('YYYY-MM-DD');
const docsToCheck = [];

const userSnapshot = await admin.firestore().collection('user').get();
const emailSnapshot = await admin.firestore().collection('email').get();

const userEmails = []; // Mapa przechowująca e-maile na podstawie klucza uid

// Pobieranie e-maili i przypisywanie ich do mapy
emailSnapshot.forEach((doc) => {
  const emailData = doc.data();
  userEmails.push(emailData)
});
console.log(userEmails);

userSnapshot.forEach((doc) => {
  const userData = doc.data();
  if (userData.hasOwnProperty('expireDate')) {
    const expireDate = moment(userData.expireDate, 'MM-DD-YYYY').startOf('days');
    
    const daysRemaining = expireDate.diff(currentDate, 'days');
    
    if (daysRemaining === 2) {
      userEmails.forEach(email => {
        if(email.uid === userData.uid) {
          userData.email = email.email;
        }
      })
      docsToCheck.push(userData);
    }
  }
});

const imagePath = path.join(__dirname, 'img', 'logo.svg'); // Replace 'image.jpg' with the actual file name and path
  
const imageBuffer = fs.readFileSync(imagePath, {encoding: null});

const base64Image = imageBuffer.toString('base64');


try {
 
  docsToCheck.forEach((doc) => {

  const mailOptions = {
  from: 'noreply.gsapp@gmail.com',
  to: doc.email,
  subject: 'Uwaga twoja licencja wygaśnie za 2 dni',
  template: "asdasd",
  attachments: [
  {
    filename: "logo.png",
    path: 'img/logo.png',
    cid: 'logo'
  }
],
  html: `
    
      <div style="background-color: #FFF; padding: 20px; text-align: center;">
        <img src="cid:logo" style="width: 250px; height: auto" alt="Logo" />
        <h1 style="color: #333333;font-size: 25px ; font-family: Arial, sans-serif;">Uwaga!</h1>
        <p style="color: #000;margin-top: 20px; font-size: 18px; font-family: Arial, sans-serif;">Twoja licencja wygaśnie za 2 dni</p>
        
      </div>
    
  `
};

  transporter.sendMail(mailOptions);
  console.log('Email sent successfully');
 }) 
} catch (error) {
  console.error('Error sending email:', error);
}
  } catch (error) {
    console.error('Błąd podczas sprawdzania daty wygaśnięcia:', error);
    return null;
  }
  
});