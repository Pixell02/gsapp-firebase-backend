const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
const transporter = require("./mail/transporter");

exports.transactionConfirmation = functions.https.onRequest((req, res) => {

  cors(req, res, async() => {
    const user = req.body.data.user;
  
  const mailOptions = {
    from: 'noreply.gsapp@gmail.com',
    to: "nikodems1308@gmail.com, s.stanczak92@gmail.com",
    subject: `${user.email} zakup zakończył się pomyślnie`,
    text: `${user.email} zakup zakończył się pomyślnie`
  };
  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully');
   
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({data: "nie wysłano"})
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Błąd wysyłania wiadomości:', error);
         res.status(500).send({ data: "nie wysłano" });
    } else {
    
      console.log('Wiadomość e-mail została wysłana:', info.response);
    res.status(200).send({ data: "wysłano" });
    }
  });
 
  })


})