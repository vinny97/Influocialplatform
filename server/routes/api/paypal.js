var express = require("express");
var router = express.Router();
var paypal = require("paypal-rest-sdk");
var config = require("../../config");
let mongoose = require("mongoose");
let Transaction = mongoose.model("Transaction");
const { sendNotification } = require("../../utilities/notification");

paypal.configure({
  mode: "live",
  client_id:
    "AeSMjKG4phjf93lqnwbo58yueyMSPBLGuFQ26xgdU7qkKITkpQN3zxFxcaE5-8eNjuDLXLlEkjGciK8Q",
  client_secret:
    "EAiJ_AIgx9NnvgcOYedfzxS0ixREa07O11yHs317sLPMEVfH5LT4R6SQdPfKq09xPN-Y1zKAXAAz8bRi",
});

router.get("/", async (req, res) => {
  if (
    typeof req.query.transactionId === "undefined" &&
    req.query.transactionId === null
  ) {
    return res.status(400).send("Transaction ID is required");
  }
  const transaction = await Transaction.findOne({
    _id: req.query.transactionId,
  }).exec();
  if (transaction === null) {
    res.send({ message: "Transaction not found" });
    return;
  } else {
    console.log("transaction", transaction);
    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url:
          config.host +
          "/api/paypal/success?transactionId=" +
          req.query.transactionId,
        cancel_url:
          config.host +
          "/api/paypal/cancel?transactionId=" +
          req.query.transactionId,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: transaction.name,
                sku: transaction.name,
                price: transaction.price.toString(),
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: transaction.price.toString(),
          },
          description: "Payment for " + transaction.name,
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log("Create Payment Response");
        console.log(payment);
        res.redirect(payment.links[1].href);
      }
    });
  }
});

router.get("/success", async (req, res) => {
  if (
    typeof req.query.transactionId === "undefined" &&
    req.query.transactionId === null
  ) {
    return res.status(400).send("Transaction ID is required");
  }
  const transaction = await Transaction.findOne({
    _id: req.query.transactionId,
  }).exec();
  transaction.status = 2;
  await transaction.save();
  sendNotification({
    title: `you have subscribed ${transaction.name}`,
    type: 1,
    sentTo: transaction.user._id,
  });
});

router.get("cancel", async (req, res) => {
  if (
    typeof req.query.transactionId === "undefined" &&
    req.query.transactionId === null
  ) {
    return res.status(400).send("Transaction ID is required");
  }
  const transaction = await Transaction.findOne({
    _id: req.query.transactionId,
  }).exec();
  transaction.status = 3;
  await transaction.save();
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>0</title>
    </head>
    <body>

    <h1>Transaction Failed</h1>

    </body>
    </html>
    `);
});

module.exports = router;
