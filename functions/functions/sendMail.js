const functions = require("firebase-functions");
const admin = require('firebase-admin');
const fs = require("fs");
const path = require("path");
const transporter = require("./mail/transporter");


exports.sendMail = functions.auth.user().onCreate(async(user) => {


  // Pobierz referencję do kolekcji 'emails'
  const emailsCollection = admin.firestore().collection('email');
  const usersCollection = admin.firestore().collection('user');

  // Tworzenie obiektu email
  const emailData = {
    email: user.email,
    uid: user.uid
  };

  // Dodanie obiektu email do kolekcji 'emails'
  await emailsCollection.add(emailData);

  // Tworzenie obiektu user
  const userData = {
    license: 'free-trial',
    numberOfFreeUse: 5,
    uid: user.uid
  };

  // Dodanie obiektu user do kolekcji 'users'
  await usersCollection.doc(user.uid).set(userData);
  
  const imagePath = path.join(__dirname, 'img', 'logo.svg'); // Replace 'image.jpg' with the actual file name and path
  
  const imageBuffer = fs.readFileSync(imagePath, {encoding: null});
  
  const base64Image = imageBuffer.toString('base64');
  const mailOptions = {
    from: 'noreply.gsapp@gmail.com',
    to: user.email,
    subject: 'Witaj w gsapp',
    template: "asdasd",
    attachments: [
    {
      filename: "logo.png",
      path: 'img/logo.png',
      cid: 'logo'
    },
    {
      filename: "5freeUsesImage.jpg",
      path: "img/5freeUsesImage.jpg",
      cid: 'baner'
    }
  ],
    html: `
      
        <div style="background-color: #FFF; padding: 20px; text-align: center;">
          <img src="cid:logo" style="width: 250px; height: auto" alt="Logo" />
          <h1 style="color: #333333;font-size: 25px ; font-family: Arial, sans-serif;">Dziękujemy za zarejestrowanie się do aplikacji!</h1>
          <p style="color: #000;margin-top: 20px; font-size: 18px; font-family: Arial, sans-serif;">Na start otrzymujesz możliwość 5 wolnych użyć ze znakiem wodnym. </p>
          <img src="cid:baner" style="width: 550px; margin-top: 20px" alt="baner" />
          <p style="color: #000;margin-top: 20px; font-family: Arial, sans-serif; font-size: 18px">Zespół grafika-sportowa</p>
        </div>
      
    `
  };
  
  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
})