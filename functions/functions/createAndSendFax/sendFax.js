const axios = require('axios');
const crypto = require("crypto");

exports.sendFax = async(response, klucz, nazwaUsera, nazwaKlucza) => {
  const url = `https://www.ifirma.pl/iapi/fakturakraj/send/${response.id}.json`; 
  const content = {
	Przelew: false,
	Pobranie: false,
	SkrzynkaEmail:"faktury@ifirma.pl",
	SzablonEmail:"Domyślny ifirma.pl",
  SkrzynkaEmailOdbiorcy: response.email
  };

  const hashWiadomosci = crypto
  .createHmac("sha1", klucz)
  .update(url + nazwaUsera + nazwaKlucza + JSON.stringify(content))
  .digest("hex");
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json; charset=UTF-8",
    Authentication: `IAPIS user=${nazwaUsera}, hmac-sha1=${hashWiadomosci}`,
  };

  try {
    const response = await axios.post(url, content, { headers: headers });
    console.log("Faktura wysłana:", response);
  } catch (error) {
    console.log(error);
  }

}