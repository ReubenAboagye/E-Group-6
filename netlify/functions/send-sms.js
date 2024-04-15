// netlify/functions/send-sms.js
const axios = require("axios");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, phoneNumber } = JSON.parse(event.body);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.HUBTEL_CLIENT_ID + ":" + process.env.HUBTEL_CLIENT_SECRET
      ).toString("base64")}`,
    },
  };

  const data = {
    From: process.env.HUBTEL_NUMBER,
    To: phoneNumber,
    Content: `Hello ${name}, thank you for contacting us!`,
    RegisteredDelivery: true,
  };

  try {
    const response = await axios.post(
      "https://api.hubtel.com/v1/messages",
      data,
      config
    );
    return { statusCode: 200, body: "SMS sent!" };
  } catch (error) {
    return { statusCode: 500, body: "Error sending SMS" };
  }
};
