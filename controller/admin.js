const model = require('../model/admin');

module.exports.main = function(req, res, next) {
    res.render('admin/index', {title: "Админ-панель"})
};


module.exports.dop = async (req, res, next) => {
    let data = await model.productDop();
    let table = await model.productReady('dops');
    if(!table.length){
        table = [];
    }else{
        table = table[0].costs
    }
    res.render('admin/dop', { title: 'Расходы', user: req.user, product: data, productReady: table});
};

module.exports.costs = async (req, res, next) => {
    let data = await model.productMain();
    let table = await model.productReady('costs');
    if(!table.length){
        table = [];
    }else{
        table = table[0].costs
    }
    res.render('admin/costs', { title: 'Расходы', user: req.user, product: data, productReady: table});
};

module.exports.tea = async (req, res, next) => {
    let data = await model.productReady('teas');
    if(!data.length){
        data = [];
    }else{
        data = data[0].costs
    }
    res.render('admin/tea', { title: 'Чай', user: req.user, data: data});
};
module.exports.coffee = async (req, res, next) => {
    let data = await model.productReady('coffees');
    if(!data.length){
        data = [];
    }else{
        data = data[0].costs
    }
    res.render('admin/coffee', { title: 'Кофе', user: req.user, data: data});
};

module.exports.store = async (req, res, next) => {
    res.render('admin/store', { title: 'Магазин', user: req.user});
};

module.exports.persons = async function(req, res, next) {
    let persons = await model.getCollections('persons');
    res.render('admin/persons', {title: "Персонал", persons: persons})
};

module.exports.marks = async function(req, res, next) {
    let marks = await model.getCollections('marks');
    res.render('admin/marks', {title: "Марки машин", marks: marks})
};

module.exports.clients = async function(req, res, next) {
    let clients = await model.getCollections('clients');
    let marks = await model.getCollections('marks');
    res.render('admin/clients', {title: "Клиенты", clients: clients, marks:marks})
};

module.exports.services = async function(req, res, next) {
    let services = await model.getCollections('services');
    res.render('admin/services', {title: "Услгуи", services: services})
};

module.exports.dopservices = async function(req, res, next) {
    let services = await model.getCollections('dopservices');
    let type = await model.getType();
    res.render('admin/dopservices', {title: "Доп. услуги", services: services, type: type})
};

module.exports.prepaid = async function(req, res, next) {
    let persons = await model.getCollections('persons');
    let prepaid = await model.getCollectionsMonth('prepaides');
    res.render('admin/prepaid', {title: "Аванс", persons:persons, prepaid:prepaid})
};

module.exports.fine = async function(req, res, next) {
    let persons = await model.getCollections('persons');
    let fine = await model.getCollectionsMonth('fines');
    res.render('admin/fine', {title: "Штраф", persons:persons, fine:fine})
};

module.exports.cashbox = async function(req, res, next) {
    let price = await model.mainPrice();
    res.render('admin/cashbox', {title: "Касса", price: price})
};

//add
module.exports.addCosts = async function(req, res, next) {
    let addCosts = await model.getCollections('productsMain');
    res.render('admin/addCosts', {title: "Добавить основной товар", addCosts:addCosts})
};

module.exports.addDop = async function(req, res, next) {
    let addDops = await model.getCollections('productsDop');
    res.render('admin/addDops', {title: "Добавить допольнительный товар", addDops:addDops})
};

module.exports.addScore = async function(req, res, next) {
    let product = await model.getCollections('products');
    res.render('admin/addScore', {title: "Добавить товар", product:product})
};

module.exports.graphicjob = async function(req, res, next) {
    let personsJob = await model.getGraphicJob();
    let administrators = await model.administrator();
    let persons = await model.washers();
    res.render('admin/graphicjob', {title: "График работ", personsJob:personsJob, administrators:administrators, persons:persons})
};

module.exports.encashment = async function(req, res, next) {
    let encahment = await model.getEncashment();
    res.render('admin/encashment', {title: "Инкассация", encahment: encahment})
};


