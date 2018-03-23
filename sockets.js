module.exports.init = function(socket){
    //получение сервисов услуг
    socket.on('getService', async (data) => {
        let services = await db.collection('services').find({name: data.name}).toArray();
        socket.emit('setService', services);
    });

    //получение сервисов доп услуг
    socket.on('getDopService', async (data) => {
        let services = await db.collection('dopservices').find({name: data.name}).toArray();
        socket.emit('setDopService', services);
    });

    //save services
    socket.on('saveServices', async (data) => {
        try{
            let inc = await db.collection('boxes').aggregate([
                {
                    $match: {}
                },
                {
                    $group: {
                        _id: null,
                        inc: {$max: "$inc"}
                    }
                }
            ]).toArray();
            if(!inc.length){
                data.inc = + 1;
            }else{
                data.inc = inc[0].inc + 1;
            }
            console.log(inc);
            return await db.collection('boxes').insert(data);
            //socket.emit('statusSave', {status: 200, msg: 'Сохранено!'});
        }catch(err){
            return err
        }
    });


    //save dopServices
    socket.on('saveDopServices', async (data) => {
        try{
            let inc = await db.collection('boxes').aggregate([
                {
                    $match: {}
                },
                {
                    $group: {
                        _id: null,
                        inc: {$max: "$inc"}
                    }
                }
            ]).toArray();
            await db.collection('boxes').updateOne({inc: inc[0].inc}, {$set: {dopServices: data.services}, $inc: {price: data.price, time: data.time}});
            socket.emit('statusDopSave', {status: 200, msg: 'Сохранено!'});
        }catch(err){
            socket.emit('statusDopSave', {status: 500, msg: err});
        }
    });


    //удаление строки
    socket.on('delString', async (data) => {
        try{
            let inc = await db.collection('boxes').aggregate([
                {
                    $match: {}
                },
                {
                    $group: {
                        _id: null,
                        inc: {$max: "$inc"}
                    }
                }
            ]).toArray();
            await db.collection('boxes').removeOne(data);
            socket.emit('statusDel', {status: 200, msg: 'Удалено!!'});
        }catch(err){
            socket.emit('statusDel', {status: 500, msg: err});
        }
    });


    //Установка статуса при клике на кнопку
    socket.on('setStatus', async (data, status) => {
        try{
            await db.collection('boxes').updateOne(data, {$set: {status: status}});
            socket.emit('getStatus', {status: 200, msg: 'Статус изменен!'});
        }catch(err){
            console.log('err status');
        }
    });

};