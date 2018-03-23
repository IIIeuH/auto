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
module.exports.timer = async() => {
    try {
        // let inc = await db.collection('boxes').aggregate([
        //     {
        //         $match: {status: 'wash'}
        //     },
        //     {
        //         $group: {
        //             _id: '$_id',
        //             inc: {$min: "$inc"}
        //         }
        //     }
        // ]).toArray();
        // if(inc.length){
        //     console.log(inc[0]._id);
        //
        // }
        await db.collection('boxes').updateOne({ status: 'wash', time: {$ne: 0}}, {$inc: {time: -1}});
        await db.collection('boxes').updateOne({ time: 0, status: 'wash'}, {$set: {status: 'ready'}});
    }catch(err){
        return err;
    }
};

