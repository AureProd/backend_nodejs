const express = require('express');
const router = express.Router()

const homeController = require('../routes/home_controller');

router.all("/", (req, res) => homeController.homePage(res, req));

module.exports = router;