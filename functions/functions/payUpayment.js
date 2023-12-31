require("dotenv").config();
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const { accessToken } = require("./accessToken/accessToken");

const MERCHANT_POS_ID = process.env.MERCHANT_POS_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;

exports.PayUPayment = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const orderData = req.body.data;

    const response = await accessToken(MERCHANT_POS_ID, CLIENT_SECRET);

    axios
      .post(
        "https://secure.payu.com/api/v2_1/orders",
        {
          customerIp: "123.123.123.123",
          merchantPosId: CLIENT_ID,
          continueUrl: "https://gsapp.pl/success",
          description: orderData.description,
          currencyCode: "PLN",
          totalAmount: orderData.totalAmount,
          buyer: {
            email: orderData.buyer.email,
            firstName: orderData.companyName
              ? orderData.companyName
              : orderData.buyer.firstName,
            lastName: orderData.NIP ? orderData.NIP : orderData.buyer.lastName,
            delivery: orderData.buyer.delivery,
          },
          products: orderData.products,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response}`,
          },
        }
      )
      .then((responseFromPayU) => {
        res
          .status(200)
          .send({ data: responseFromPayU.request.res.responseUrl });
      })
      .catch((errorFromPayU) => {
        console.error(errorFromPayU);
        res.status(500).send({ error: errorFromPayU.message });
      });
  });
});
