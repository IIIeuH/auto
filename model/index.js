module.exports.main = async() => {
    try {
        return await db.collection('services').distinct("name");
    }catch(err){
        return err;
    }
};