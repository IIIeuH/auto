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

module.exports.prize = async (req, res, next) => {
    let persons = await model.getCollections('persons');
    let data = await model.productReady('prizes');
    res.render('admin/prize', { title: 'Премии', user: req.user, prize: data, persons:persons});
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

module.exports.report = async function(req, res, next) {
    let data = {};
    data.washers = await model.getWashers();

    let carPromise = data.washers.map( (item) => {
        return model.getCountCar(item.fio);
    });

    data.cars = await Promise.all(carPromise);

    let sumPromise = data.washers.map( (item) => {
        return model.getSum(item.fio);
    });

    data.sum = await Promise.all(sumPromise);

    let mainCostsPromise = data.washers.map( (item) => {
        return model.getCosts(item.fio);
    });

    data.costs = await Promise.all(mainCostsPromise);

    let dopCostsPromise = data.washers.map( (item) => {
        return model.getDopCosts(item.fio);
    });

    data.dopCosts = await Promise.all(dopCostsPromise);

    let arbitrarysPromise = data.washers.map( (item) => {
        return model.getArbitrarys(item.fio);
    });

    data.arbitrars = await Promise.all(arbitrarysPromise);

    let discountPromise = data.washers.map( (item) => {
        return model.getDiscount(item.fio);
    });

    data.discount = await Promise.all(discountPromise);


    let scoresPromise = data.washers.map( (item) => {
        return model.getScores(item.fio);
    });

    data.scores = await Promise.all(scoresPromise);

    let cardPromise = data.washers.map( (item) => {
        return model.getCard(item.fio);
    });

    data.cards = await Promise.all(cardPromise);

    let deferPromise = data.washers.map( (item) => {
        return model.getDefer(item.fio);
    });

    data.deferCash = await Promise.all(deferPromise);

    let vipPromise = data.washers.map( (item) => {
        return model.getVip(item.fio);
    });

    data.vip = await Promise.all(vipPromise);

    let prevDeferCashPromise = data.washers.map( (item) => {
        return model.getPrevDeferCash(item.fio);
    });

    data.prevDeferCash = await Promise.all(prevDeferCashPromise);


    data.cashboxAll = await model.getCashboxes();


    let vipSum = 0;
    data.vip.forEach((item) =>{
       if(item.length){
           vipSum += item[0].sum;
       }
    });

    if(data.cashboxAll.length){
        let p = 0;
        data.cashbox = data.cashboxAll.reduce((accum, current) =>{
            return accum + current.all;
        }, p);
        data.prepaid = data.cashboxAll.reduce((accum, current) =>{
            return accum + current.prepaid;
        }, p);
        data.coffee = data.cashboxAll.reduce((accum, current) =>{
            return accum + current.coffee;
        }, p);
        data.tea = data.cashboxAll.reduce((accum, current) =>{
            return accum + current.tea;
        }, p);
        data.coffeeT = data.cashboxAll.reduce((accum, current) =>{
            return accum + current.coffeeT;
        }, p);
    }else{
        data.cashbox = 0;
    }
    data.cashbox -= vipSum;


    res.render('admin/report', {title: "Отчетность", data })
};


