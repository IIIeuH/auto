const express = require('express');
const router = express.Router();
const ctrl = require('../controller/admin');

/* GET users listing. */
router.get('/', ctrl.main);
router.get('/persons', ctrl.persons);
router.get('/marks', ctrl.marks);
router.get('/clients', ctrl.clients);
router.get('/services', ctrl.services);
router.get('/dopservices', ctrl.dopservices);

module.exports = router;
