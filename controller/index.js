const model = require('../model/index');

module.exports.main = async (req, res, next) => {
    let data = await Promise.all([
         model.time('1'),
         model.time('2'),
         model.time('3'),
         model.time('4'),
         model.time('5'),
    ]);
    let box1, box2, box3, box4, box5;
    if(data[0][0]){
        box1 = data[0][0].time;
    }else{
        box1 = 0;
    }
    if(data[1][0]){
        box2 = data[1][0].time;
    }else{
        box2 = 0;
    }
    if(data[2][0]){
        box3 = data[2][0].time;
    }else{
        box3 = 0;
    }
    if(data[3][0]){
        box4 = data[3][0].time;
    }else{
        box4 = 0;
    }
    if(data[4][0]){
        box5 = data[4][0].time;
    }else{
        box5 = 0;
    }
    res.render('box', { title: 'Express', user: req.user, box1: box1, box2: box2, box3: box3, box4: box4, box5: box5});
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