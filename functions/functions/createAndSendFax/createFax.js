const moment = require('moment');
const axios = require('axios');
const crypto = require("crypto");

exports.createFax = async(data, klucz, url, nazwaUsera, nazwaKlucza) => {

  const currentDate = moment().format('YYYY-MM-DD');
  
  const positions = data.products.map((product) => {
    return {
    CenaJednostkowa: parseFloat(product.unitPrice/100),
    StawkaVat: 0.23,
    Ilosc: Number(product.quantity),
    NazwaPelna: product.name,
    Jednostka: "sztuk",
    TypStawkiVat: "PRC"
    }
  });
  const buyer = {
    Nazwa: isNaN(parseInt(data.buyer.lastName)) ? data.buyer.firstName + " " + data.buyer.lastName : data.buyer.firstName,
    NIP: isNaN(parseInt(data.buyer.lastName)) ? null : parseInt(data.buyer.lastName),
    Ulica: data.buyer.delivery.street,
    KodPocztowy: data.buyer.delivery.postalCode,
    Miejscowosc: data.buyer.delivery.city,
    Email: data.buyer.email,
    OsobaFizyczna: isNaN(parseInt(data.buyer.lastName)) ? true : false
  };
  
  
  const requestData = {
    Zaplacono: Number(data.totalAmount/100),
    ZaplaconoNaDokumencie: Number(data.totalAmount/100),
    LiczOd: "BRT",
    DataWystawienia: currentDate,
    MiejsceWystawienia: "Brzezie k.Sulechowa",
    DataSprzedazy: currentDate,
    FormatDatySprzedazy:"DZN",
    SposobZaplaty:"ALG",
    RodzajPodpisuOdbiorcy:"BWO",
    WidocznyNumerGios:false,
    Numer:null,
    Pozycje: positions,
    Kontrahent: buyer
  }
  console.log(requestData)
  
  const hashWiadomosci = crypto
  .createHmac("sha1", klucz)
  .update(url + nazwaUsera + nazwaKlucza + JSON.stringify(requestData))
  .digest("hex");

  const headers = {
    Accept: "application/json",
    "Content-type": "application/json; charset=UTF-8",
    Authentication: `IAPIS user=${nazwaUsera}, hmac-sha1=${hashWiadomosci}`,
  };
  try {
    const response = await axios.post(url, JSON.stringify(requestData), { headers: headers });
    console.log(response.data.response);
    return { id: response.data.response.Identyfikator, email: data.buyer.email };
  } catch (error) {
    console.log(error);
    // Tutaj możesz obsłużyć błąd żądania
    throw error;
  }

  
}