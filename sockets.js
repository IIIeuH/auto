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
    socket.on('saveServices', async (data, cb) => {
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
            await db.collection('boxes').insert(data);
            cb({status:200, msg: 'Услуги сохранены!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //save dopServices
    socket.on('saveDopServices', async (data, query, cb) => {
        try{
            await db.collection('boxes').updateOne(query, {$set: {dopServices: data.services, dopPrice:  data.price, dopTime: data.time}, $inc: {price: data.price, time: data.time}});
            cb({status:200, msg: 'Доп. услуги сохранены!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //save redactServices
    socket.on('saveRedactServices', async (data, query, cb) => {
        try{
            await db.collection('boxes').updateOne(query, {$set: {services: data.services, mainPrice:  data.price, mainTime: data.time}});
            cb({status:200, msg: 'Услуги отредактированы!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //удаление строки
    socket.on('delString', async (data, cb) => {
        try{
            await db.collection('boxes').removeOne(data);
            cb({status:200, msg: 'Удалено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Установка статуса при клике на кнопку
    socket.on('setStatus', async (data, status, cb) => {
        try{
            await db.collection('boxes').updateOne(data, {$set: {status: status}});
            cb({status:200, msg: 'Статус изменен!'});
        }catch(err){
            cb({status:500, msg: err});
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

    socket.on('setCosts', async (data, cb) => {
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
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    socket.on('saveProductDop', async (data, cb) => {
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashDops: price[0].cash}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    socket.on('saveProductMain', async (data, cb) => {
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashCosts: price[0].cash}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Цена в кассе
    socket.on('cachbox', async (cb) =>{
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashCar: allPrice[0].cash}}, {upsert: true});
        }catch(err){
            cb({status:500, msg: 'Касса не обновлена!'});
        }
    });

    //Сохранение чая
    socket.on('saveTea', async (data, cb) => {
        try{
            await db.collection('teas').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), costs: data}}, {upsert: true});

            let allPrice = await db.collection('teas').aggregate([
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashTea: allPrice[0].cash}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:200, msg: err});
        }
    });

    //Редактирование чая
    socket.on('redactorTea', async (data, cb) => {
        try{
            await db.collection('teas').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {costs: data}});

            let allPrice = await db.collection('teas').aggregate([
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashTea: allPrice[0].cash}}, {upsert: true});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Сохранение кофе
    socket.on('saveCoffee', async (data, cb) => {
        try{
            await db.collection('coffees').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), costs: data}}, {upsert: true});
            let allPrice = await db.collection('coffees').aggregate([
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashCoffee: allPrice[0].cash}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Редактирование Кофе
    socket.on('redactorCoffee', async (data, cb) => {
        try{
            await db.collection('coffees').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {costs: data}});

            let allPrice = await db.collection('coffees').aggregate([
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashCoffee: allPrice[0].cash}}, {upsert: true});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Сохранение кофе машины
    socket.on('saveMachines', async (start, end, cb) => {
        try{
            await db.collection('scores').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {startCoffee: start, endCoffee: end}}, {upsert: true});
            let price = await db.collection('scores').aggregate([
                {
                    $match: {$and: [{date: moment().format('DD.MM.YYYY')}, {andCoffee: {$ne: 0}}]}
                },
                {
                    $project: {_id: 0, cash: {$multiply : [{$subtract: ['$startCoffee', '$endCoffee']}, 100]}}
                }
            ]).toArray();
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), cashCoffeeMachine: price[0].cash}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Сохранение персонала
    socket.on('savePersons', async(data, cb) => {
       try{
           await db.collection('persons').insertOne(data);
           cb({status:200, msg: 'Сохранено!'});
       }catch(err){
           cb({status:500, msg: err});
       }
    });

    //Обновление персонала
    socket.on('updatePersons', async(data, cb) =>{
       try{
           await db.collection('persons').updateOne({_id: ObjectId(data._id)}, {$set: {fio: data.fio}});
           cb({status:200, msg: 'Обновлено!'});
       }catch(err){
           cb({status:500, msg: err});
       }
    });

    //Сохранение Марки
    socket.on('saveMarks', async(data, cb) => {
        try{
            await db.collection('marks').insertOne(data);
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Обновление марки
    socket.on('updateMarks', async(data, cb) =>{
        try{
            await db.collection('marks').updateOne({_id: ObjectId(data._id)}, {$set: {marka: data.marka}});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Сохранение клиента
    socket.on('saveClients', async (data, cb) => {
       try{
           await db.collection('clients').insertOne(data);
           cb({status:200, msg: 'Сохранено!'});
       } catch(err){
           cb({status:500, msg: err});
       }
    });

    //Обновление клиентов
    socket.on('updateClients', async(id, data, cb) =>{
        try{
            await db.collection('clients').updateOne({_id: ObjectId(id)}, {$set: data});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //автозаполнение номера
    socket.on('autocomplete', async (data, cb) => {
       try{
           let number = await db.collection('clients').find({number: {$regex: data}}, {_id: 0, number: 1, marka: 1}).toArray();
           cb(number);
       }catch(err){
           console.log(`err update autocomplete ${err}`);
       }
    });
};