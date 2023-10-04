const axios = require("axios");


exports.accessToken = async(MERCHANT_POS_ID, CLIENT_SECRET) => {
  
  const params = {
    grant_type: "client_credentials",
    client_id: MERCHANT_POS_ID,
    client_secret: CLIENT_SECRET,
  };
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  try {
  const response = await axios.post("https://secure.payu.com/pl/standard/user/oauth/authorize", params, {headers})
  return response.data.access_token
  } catch (err) {
    console.error(err);
    throw err;
  }
  
}