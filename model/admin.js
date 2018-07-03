const moment = require('moment');

module.exports.productMain = async() => {
    try {
        return await db.collection('productsMain').find({}).toArray();
    }catch(err){
        return err;
    }
};


module.exports.productDop = async() => {
    try {
        return await db.collection('productsDop').find({}).toArray();
    }catch(err){
        return err;
    }
};

module.exports.productReady = async(collection) => {
    try {
        return await db.collection(collection).find({date: moment().format('DD.MM.YYYY')}).toArray();
    }catch(err){
        return err;
    }
};

module.exports.getCollections = async function(persons){
    return await db.collection(persons).find({}).toArray();
};
module.exports.getType = async function(){
    return await db.collection('services').distinct("name");
};

module.exports.getCollectionsMonth = async function(persons){
    let date = getMonthDateRange(moment().year(), moment().month());
    return await db.collection(persons).find({dateD: {$gte: date.start.toDate(), $lte: date.end.toDate()}}).toArray();
};

module.exports.getGraphicJob = async function(){
    let date = getMonthDateRange(moment().year(), moment().month());
    return await db.collection('boxes').find({dateD: {$gte: date.start.toDate(), $lte: date.end.toDate()}, status: "ready"}, {date: 1, administrator: 1, washer: 1, services: 1, mainPrice: 1, dopServices: 1, dopPrice: 1}).toArray();
};

module.exports.mainPrice = async function(){
    return await db.collection('cashboxes').find().toArray();
};

module.exports.administrator = async() => {
    try {
        return await db.collection('persons').find({administrator: true}).toArray();
    }catch(err){
        return err;
    }
};

module.exports.washers = async() => {
    try {
        return await db.collection('persons').find({$or: [{administrator: false}, {administrator: {$exists: false}}]}).toArray();
    }catch(err){
        return err;
    }
};

module.exports.getEncashment = async() => {
    try {
        let date = getMonthDateRange(moment().year(), moment().month());
        return await db.collection('cashboxes').find({dateD: {$gte: date.start.toDate(), $lte: date.end.toDate()}, encashment: {$exists: true}}, {encashment: 1, date: 1}).toArray();
    }catch(err){
        return err;
    }
};



function getMonthDateRange(year, month) {
    let startDate = moment([year, month]);
    let endDate = moment(startDate).endOf('month');
    return { start: startDate, end: endDate };
}


//Reports

module.exports.getWashers = async() => {
    try{
        return await db.collection('persons').find({administrator: false}, {_id: 0, administrator: 0}).toArray();
    }catch (err){
        console.log(err);
    }
};

module.exports.getCountCar = async(washer) => {
    try{
        return await db.collection('boxes').count({washer: washer, status: 'ready'});
    }catch (err){
        console.log(err);
    }
};

module.exports.getSum = async(washer) => {
    try{
        return await db.collection('boxes').aggregate(
            {
                $match: {washer: washer, status: 'ready'}
            },
            {
                $project: {_id: 0, sum: {$sum: ['$mainPrice', '$dopPrice']}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};


module.exports.getCosts = async(washer) => {
    try{
        return await db.collection('costs').aggregate(
            {
                $match: {name: washer}
            },
            {
              $unwind: "$costs"
            },
            {
                $project: {_id: 0, sum: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};


module.exports.getDopCosts = async(washer) => {
    try{
        return await db.collection('dops').aggregate(
            {
                $match: {name: washer}
            },
            {
                $unwind: "$costs"
            },
            {
                $project: {_id: 0, sum: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};


module.exports.getArbitrarys = async(washer) => {
    try{
        return await db.collection('arbitrarys').aggregate(
            {
                $match: {name: washer}
            },
            {
                $unwind: "$costs"
            },
            {
                $group: {_id: null, sum: {$sum: '$costs.price'}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};

module.exports.getDiscount = async(washer) => {
    try{
        return await db.collection('boxes').aggregate(
            {
                $match: {washer: washer, status: 'ready'}
            },
            {
                $group: {_id: null, sum: {$sum: '$discount'}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};


module.exports.getScores = async(washer) => {
    try{
        return await db.collection('scores').aggregate(
            {
                $match: {name: washer}
            },
            {
                $unwind: "$costs"
            },
            {
                $group: {_id: null, sum: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};

module.exports.getCard = async(washer) => {
    try{
        return await db.collection('boxes').aggregate(
            {
                $match: {washer: washer, nonCash: true, status: 'ready'}
            },
            {
              $project: {_id: null, sum: {$sum: ['$mainPrice', '$dopPrice']}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};


module.exports.getDefer = async(washer) => {
    try{
        return await db.collection('boxes').aggregate(
            {
                $match: {washer: washer, deferCash: true, status: 'ready'}
            },
            {
                $project: {_id: null, sum: {$sum: ['$mainPrice', '$dopPrice']}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};





module.exports.getDeferCash = async(washer) => {
    try{
        return await db.collection('boxes').aggregate(
            {
                $match: {washer: washer, deferCash: true, status: 'ready'}
            },
            {
                $project: {_id: null, sum: {$subtract: [{$sum: ['$mainPrice', '$dopPrice']}, '$discount']}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};


module.exports.getVip = async(washer) => {
    try{
        return await db.collection('boxes').aggregate(
            {
                $match: {washer: washer, vip: true, status: 'ready'}
            },
            {
              $project: {_id: null, sum: {$sum: ['$mainPrice', '$dopPrice']}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};



module.exports.getPrevDeferCash = async(washer) => {
    try{
        return await db.collection('boxes').aggregate(
            {
                $match: {washer: washer, deferCash: false, status: 'ready'}
            },
            {
                $project: {_id: null, sum: {$sum: ['$mainPrice', '$dopPrice']}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            },
            {
                $group: {_id: null, sum: {$sum: '$sum'}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};

module.exports.getCashboxes = async() => {
    try{
        return await db.collection('cashboxes').aggregate(
            {
                $match: {}
            },
            {
                $project: {_id: null, prepaid: {$sum: ['$cashPrepaid']}, coffee: {$sum: ['$cashCoffeeMachine']}, tea: {$sum: ['$cashTea']}, coffeeT: {$sum: ['$cashCoffee']}, all: {$sum: ['$encashment', '$cashPrepaid', '$cashCar', '$discountCash', '$cashCosts', '$cashDops', '$arbitrary', '$cashScore', '$cashCoffeeMachine', '$deferCash', '$cashTea', '$cashCoffee']}}
            },
            {
                $group: {_id: null, all: {$sum: ['$all']}}
            }).toArray();
    }catch (err){
        console.log(err);
    }
};