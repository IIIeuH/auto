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
router.get('/prepaid', ctrl.prepaid);
router.get('/fine', ctrl.fine);
router.get('/cashbox', ctrl.cashbox);
router.get('/dop',  ctrl.dop);
router.get('/costs',  ctrl.costs);
router.get('/tea',  ctrl.tea);
router.get('/coffee',  ctrl.coffee);
router.get('/store',  ctrl.store);
router.get('/add/costs',  ctrl.addCosts);
router.get('/add/dop',  ctrl.addDop);
router.get('/add/score',  ctrl.addScore);
router.get('/graphicjob',  ctrl.graphicjob);

module.exports = router;
