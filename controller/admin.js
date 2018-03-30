const model = require('../model/admin');

module.exports.main = function(req, res, next) {
    res.render('admin/index', {title: "Админ-панель"})
};

module.exports.persons = async function(req, res, next) {
    let persons = await model.getCollections('persons');
    res.render('admin/persons', {title: "Персонал", persons: persons})
};