require('dotenv/config');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const authRoute = require('./routes/auth.route');
const chargeRoute = require('./routes/charge.route');

const { httpLogStream } = require('./utils/logger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(morgan('combined', { stream: httpLogStream }));
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api', chargeRoute);

app.get('/', (req, res) => {
    res.status(200).send({
        status: "success",
        data: {
            message: "API working fine"
        }
    });
});

app.post('/api/connection_token', async (req, res) => {
    const token = await stripe.terminal.connectionTokens.create();
    console.log(token);
    res.json({secret: token.secret});
  });

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: "error",
        message: err.message
    });
    next();
});

module.exports = app;