const model = require('../model/index');

module.exports.main = async (req, res, next) => {
    let auto = await model.main();
    res.render('index', { title: 'Express', user: req.user, typeAuto: auto });
};