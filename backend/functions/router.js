const express = require('express');
const router = express.Router()

const homeController = require('../routes/home_controller');

router.all("/", homeController.homePage);

module.exports = router;