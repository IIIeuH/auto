const model = require('../model/index');

module.exports.main = async (req, res, next) => {
    let data = await Promise.all([
         model.time('1'),
         model.time('2'),
         model.time('3'),
         model.time('4'),
         model.time('5'),
    ]);
    let box1 = data[0][0].time;
    res.render('box', { title: 'Express', user: req.user, box1: box1});
};

module.exports.box = async (req, res, next) => {
    let auto = await model.main();
    let dopAuto = await model.dopServices();
    let data = await model.data(req.query.number);
    res.render('index', { title: 'Express', user: req.user, typeAuto: auto, dopAuto:  dopAuto, data: data});
};

module.exports.prepaid = async (req, res, next) => {
    res.render('prepaid', { title: 'Аванс', user: req.user });
};

module.exports.other = async (req, res, next) => {
    res.render('other', { title: 'Другое', user: req.user });
};