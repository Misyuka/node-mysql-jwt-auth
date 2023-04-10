require('dotenv/config');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const db = require('../config/db.config');
const { decode: decode } = require('../utils/token');
const User = require('../models/user.model');

exports.charge = (req, res) => {
    var id = req.body.id;
    var token = req.body.token;
    var user = decode(token);

    if (user) {
        console.log(user);
        User.findById(user.id, async (err, data) => {
            console.log(data);
            const paymentIntent = await stripe.paymentIntents.capture(id);
            const charge = await stripe.charges.retrieve(
                paymentIntent.latest_charge
              );
            db.query("INSERT INTO stripe_transactions(transaction_id, customer_id, product, amount, currency, card_type, last_four, exp, fees, created_at, payment_source, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [
                paymentIntent.id,
                user.id,
                "", 
                paymentIntent.amount, 
                paymentIntent.currency,
                charge.payment_method_details[charge.payment_method_details.type].brand,
                charge.payment_method_details[charge.payment_method_details.type].last4,
                charge.payment_method_details[charge.payment_method_details.type].exp_year + "-" + charge.payment_method_details[charge.payment_method_details.type].exp_month,
                0,
                paymentIntent.created,
                charge.payment_method_details.type,
                paymentIntent.status
            ], (err, result) => {
                if (err) {
                    console.log([
                        paymentIntent.id,
                        user.id,
                        "", 
                        paymentIntent.amount, 
                        paymentIntent.currency,
                        charge.payment_method_details[charge.payment_method_details.type].brand,
                        charge.payment_method_details[charge.payment_method_details.type].last4,
                        charge.payment_method_details[charge.payment_method_details.type].exp_year + "-" + charge.payment_method_details[charge.payment_method_details.type].exp_month,
                        0,
                        paymentIntent.created,
                        charge.payment_method_details.type,
                        paymentIntent.status
                    ]);
                    console.log("DB Error:" + err);
                    res.json({
                        status: "error",
                        message: err.message
                    });
                    return;
                }
                res.json({status: "success"});
            });
        });
    }
    else {
        res.json({
            status: "error",
            message: "Unauthenticated"
        });
    }
}