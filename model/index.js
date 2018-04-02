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

module.exports.time = async(number) => {
    try {
        return await db.collection('boxes').aggregate([
            {
                $match: {box: number, date: moment().format('DD.MM.YYYY')}
            },
            {
                $project: {_id: 0, time: {$sum: ['$mainTime', '$dopTime']}}
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
