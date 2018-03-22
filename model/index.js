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

module.exports.time = async(number) => {
    try {
        return await db.collection('boxes').aggregate([
            {
                $match: {box: number, date: moment().format('DD.MM.YYYY')}
            },
            {
                $group: {_id: null, time: {$sum: '$time'}}
            }
        ]).toArray();
    }catch(err){
        return err;
    }
};