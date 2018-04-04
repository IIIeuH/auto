module.exports.init = function(socket){
    //получение сервисов услуг
    socket.on('getService', async (data) => {
        let services = await db.collection('services').find({name: data.name}).toArray();
        socket.emit('setService', services);
    });

    //получение сервисов доп услуг
    socket.on('setDopServiceTypeAuto', async (data) => {
        let services = await db.collection('dopservices').find({name: data}).toArray();
        socket.emit('setDopService', services);
    });

    //получение сервисов услуг редактирование
    socket.on('setRedactServiceTypeAuto', async (data) => {
        let services = await db.collection('services').find({name: data}).toArray();
        socket.emit('setRedactService', services);
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
            return await db.collection('boxes').insert(data);
            //socket.emit('statusSave', {status: 200, msg: 'Сохранено!'});
        }catch(err){
            return err
        }
    });


    //save dopServices
    socket.on('saveDopServices', async (data, query) => {
        try{
            // let inc = await db.collection('boxes').aggregate([
            //     {
            //         $match: {}
            //     },
            //     {
            //         $group: {
            //             _id: null,
            //             inc: {$max: "$inc"}
            //         }
            //     }
            // ]).toArray();
            await db.collection('boxes').updateOne(query, {$set: {dopServices: data.services, dopPrice:  data.price, dopTime: data.time}, $inc: {price: data.price, time: data.time}});
            socket.emit('statusDopSave', {status: 200, msg: 'Сохранено!'});
        }catch(err){
            socket.emit('statusDopSave', {status: 500, msg: err});
        }
    });


    //save dopServices
    socket.on('saveRedactServices', async (data, query) => {
        try{
            await db.collection('boxes').updateOne(query, {$set: {services: data.services, mainPrice:  data.price, mainTime: data.time}});
            socket.emit('statusRedactSave', {status: 200, msg: 'Сохранено!'});
        }catch(err){
            socket.emit('statusRedactSave', {status: 500, msg: err});
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

    //Продукты
    socket.on('getProduct', async () => {
        try{
            let product = await db.collection('products').find({}).toArray();
            socket.emit('setProduct', product);
        }catch(err){
            console.log('err product ', err);
        }
    });

    socket.on('setCosts', async (data) => {
        try{
            await db.collection('scores').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), costs: data } }, {upsert: true});
            let price = await db.collection('scores').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $unwind: "$costs"
                },
                {
                    $project: {_id: 0, cash: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                }
            ]).toArray();
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashScore: price[0].cash}}, {upsert: true})
        }catch(err){
            console.log(`err costs ${err}`);
        }
    });

    socket.on('saveProductDop', async (data) => {
        try{
            await db.collection('dops').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), costs: data } }, {upsert: true});
            let price = await db.collection('dops').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $unwind: "$costs"
                },
                {
                    $project: {_id: 0, cash: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                }
            ]).toArray();
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashDops: price[0].cash}}, {upsert: true})
        }catch(err){
            console.log(`err costs ${err}`);
        }
    });

    socket.on('saveProductMain', async (data) => {
        try{
            await db.collection('costs').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), costs: data } }, {upsert: true});
            let price = await db.collection('costs').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $unwind: "$costs"
                },
                {
                    $project: {_id: 0, cash: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                }
            ]).toArray();
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashCosts: price[0].cash}}, {upsert: true})
        }catch(err){
            console.log(`err costs ${err}`);
        }
    });


    //Сохранение персонала
    socket.on('savePersons', async(data) => {
       try{
           return await db.collection('persons').insertOne(data);
       }catch(err){
           console.log(`err save persons ${err}`);
       }
    });

    //Обновление персонала
    socket.on('updatePersons', async(data) =>{
       try{
           return await db.collection('persons').updateOne({_id: ObjectId(data._id)}, {$set: {fio: data.fio}});
       }catch(err){
           console.log(`err update persons ${err}`);
       }
    });


    //Цена в кассе
    socket.on('cachbox', async () =>{
       try{
           let allPrice = await db.collection('boxes').aggregate([
               {
                   $match: {date: moment().format('DD.MM.YYYY')}
               },
               {
                   $project: {_id: 0, cash: {$sum: ['$mainPrice', '$dopPrice']}}
               },
               {
                   $group: {_id: null, cash: {$sum: '$cash'}}
               }
           ]).toArray();
           await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashCar: allPrice[0].cash}}, {upsert: true})
       }catch(err){
           console.log(err);
       }
    });

};