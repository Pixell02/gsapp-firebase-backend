require("dotenv").config();
const functions = require("firebase-functions");
const { createFax } = require("./createAndSendFax/createFax");
const { sendFax } = require("./createAndSendFax/sendFax");
const cors = require("cors")({ origin: true });

exports.createFax = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const data = req.body.data.order;
    console.log(data);
    const key = process.env.IFIRMA_KEY;
    const klucz = Buffer.from(key, "hex");

    const url = "https://www.ifirma.pl/iapi/fakturakraj.json";
    const nazwaUsera = process.env.IFIRMA_EMAIL;
    const nazwaKlucza = "faktura";

    const response = await createFax(data, klucz, url, nazwaUsera, nazwaKlucza);
    console.log(response);
    if (response.id) {
      sendFax(response, klucz, nazwaUsera, nazwaKlucza);
    }

    res.status(200).send({ data: "faktura utworzona" });
  });
});
