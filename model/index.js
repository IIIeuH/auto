const moment = require('moment');
module.exports.main = async() => {
    try {
        return await db.collection('services').distinct("name");
    }catch(err){
        return err;
    }
};
module.exports.dopServices = async() => {
    try {
        return await db.collection('dopservices').distinct("name");
    }catch(err){
        return err;
    }
};

module.exports.data = async(query) => {
    try {
        return await db.collection('boxes').find({box: query, date: moment().format('DD.MM.YYYY')}).toArray();
    }catch(err){
        return err;
    }
};

module.exports.getCollection = async(collection, params) => {
    try {
        return await db.collection(collection).find({}, params).toArray();
    }catch(err){
        return err;
    }
};

module.exports.getDeferCash = async() => {
    try {
        return await db.collection('boxes').find({deferCash: true}).toArray();
    }catch(err){
        return err;
    }
};

module.exports.getPerson = async() => {
    try {
        return await db.collection('persons').find({administrator: false}).toArray();
    }catch(err){
        return err;
    }
};


module.exports.administrator = async() => {
    try {
        return await db.collection('persons').find({administrator: true}).toArray();
    }catch(err){
        return err;
    }
};

module.exports.time = async(number) => {
    try {
        return await db.collection('boxes').aggregate([
            {
                $match: {box: number, date: moment().format('DD.MM.YYYY'), status: {$ne: "ready"}}
            },
            {
                $project: {_id: 0, time: {$sum: ['$mainTime', '$dopTime']}}
            },
            {
                $group: {_id: null, time: {$sum: '$time'}}
            }
        ]).toArray();
    }catch(err){
        return err;
    }
};
module.exports.timer = async() => {
    try {
        await db.collection('boxes').updateOne({ status: 'wash', time: {$ne: 0}}, {$inc: {time: -1}});
        await db.collection('boxes').updateOne({ time: 0, status: 'wash'}, {$set: {status: 'ready'}});
    }catch(err){
        return err;
    }
};

module.exports.product = async() => {
    try {
        return await db.collection('products').find({}).toArray();
    }catch(err){
        return err;
    }
};


module.exports.startCoffee = async() => {
    try {
        return await db.collection('scores').findOne({date: moment().subtract(1, 'days').format('DD.MM.YYYY')}, {_id: 0, startCoffee: 1});
    }catch(err){
        return err;
    }
};

module.exports.coffee = async() => {
    try {
        return await db.collection('scores').findOne({date: moment().format('DD.MM.YYYY')}, {endCoffee: 1, _id: 0});
    }catch(err){
        return err;
    }
};

module.exports.productReady = async(collection) => {
    try {
        return await db.collection(collection).find({date: moment().format('DD.MM.YYYY')}, {costs: 1}).toArray();
    }catch(err){
        return err;
    }
};
