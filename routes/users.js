const express = require('express');
const router = express.Router();
const ctrl = require('../controller/admin');

/* GET users listing. */
router.get('/', ctrl.main);
router.get('/persons', ctrl.persons);

module.exports = router;
