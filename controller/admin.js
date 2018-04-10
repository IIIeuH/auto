const model = require('../model/admin');

module.exports.main = function(req, res, next) {
    res.render('admin/index', {title: "Админ-панель"})
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
    res.render('admin/services', {title: "Клиенты", services: services})
};

module.exports.dopservices = async function(req, res, next) {
    let services = await model.getCollections('dopservices');
    let type = await model.getType();
    console.log(type);
    res.render('admin/dopservices', {title: "Клиенты", services: services, type: type})
};