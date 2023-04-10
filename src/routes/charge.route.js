const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const chargeController = require('../controllers/charge.controller');


router.route('/charge')
    .post(asyncHandler(chargeController.charge));

module.exports = router;