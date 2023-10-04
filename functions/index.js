const admin = require('firebase-admin');
const functions = require("firebase-functions");


const { checkingExpirationDates } = require("./functions/checkingExpirationDates");
const { checkTransactionStatus } = require("./functions/checkTransactionStatus");
const { createFax } = require("./functions/createFax");
const { createTransactionInfo } = require("./functions/createTransactionInfo");
const { getOrder } = require("./functions/getOrder");
const { payUpayment } = require("./functions/payUpayment");
const { runEvery24hours } = require("./functions/runEvery24hours");
const { sendMail } = require("./functions/sendMail");
const {transactionConfirmation} = require("./functions/transactionConfirmation");


admin.initializeApp();



exports.getOrder = getOrder;
exports.createTransactionInfo = createTransactionInfo;
exports.checkingExpirationDates = checkingExpirationDates;
exports.checkTransactionStatus = checkTransactionStatus;
exports.payUpayment = payUpayment;
exports.runEvery24hours = runEvery24hours;
exports.createFax = createFax;
exports.sendMail = sendMail;
exports.transactionConfirmation = transactionConfirmation;


