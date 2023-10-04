const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const { accessToken } = require("./accessToken/accessToken");

const MERCHANT_POS_ID = "4283004";
const CLIENT_SECRET = "7f60f24a1573881fe8ea9e19698265d4";

exports.getOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const orderId = req.body.data.orderId;
    const response = await accessToken(MERCHANT_POS_ID, CLIENT_SECRET);

    const config = {
      headers: {
        Authorization: `Bearer ${response}`,
      },
    };

    try {
      const orderResponse = await axios.get(`https://secure.payu.com/api/v2_1/orders/${orderId}`, config);
      console.log(orderResponse);
      res.status(200).json({ data: orderResponse.data.orders });
    } catch (err) {
      console.error(err);
      throw err;
    }
  });
});