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

module.exports.mainPrice = async function(){
    return await db.collection('cashboxes').find().toArray();
};




function getMonthDateRange(year, month) {
    let startDate = moment([year, month]);
    let endDate = moment(startDate).endOf('month');
    return { start: startDate, end: endDate };
}