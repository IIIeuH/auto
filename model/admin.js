const moment = require('moment');

module.exports.getCollections = async function(persons){
    return await db.collection(persons).find({}).toArray();
};
module.exports.getType = async function(){
    return await db.collection('services').distinct("name");
};