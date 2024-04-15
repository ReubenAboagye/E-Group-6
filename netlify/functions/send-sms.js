// netlify/functions/send-sms.js
const axios = require("axios");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let data;

  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return { statusCode: 400, body: "Invalid JSON format" };
  }

  const { name, phoneNumber } = data;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.REACT_HUBTEL_CLIENT_ID +
          ":" +
          process.env.REACT_HUBTEL_CLIENT_SECRET
      ).toString("base64")}`,
    },
  };

  const smsData = {
    From: process.env.REACT_HUBTEL_NUMBER,
    To: phoneNumber,
    Content: `Hello ${name}, thank you for contacting us!`,
    RegisteredDelivery: true,
  };

  try {
    const response = await axios.post(
      "https://api.hubtel.com/v1/messages",
      smsData,
      config
    );
    return { statusCode: 200, body: "SMS sent!" };
  } catch (error) {
    return { statusCode: 500, body: "Error sending SMS" };
  }
};
