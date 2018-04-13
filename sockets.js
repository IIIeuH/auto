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
            data.dateD = new Date();
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
            if(price.length){
                price = price[0].cash;
            }else{
                price = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashScore: price}}, {upsert: true});
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
            if(price.length){
                price = -price[0].cash;
            }else{
                price = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashDops: price}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    socket.on('saveProductMain', async (data, cb) => {
        try{
            console.log(data);
            await db.collection('costs').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {costs: data} }, {upsert: true});
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
            if(price.length){
                price = -price[0].cash;
            }else{
                price = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashCosts: price}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Цена в кассе
    socket.on('cachbox', async (cb) =>{
        try{
            let price = await db.collection('boxes').aggregate([
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
            if(price.length){
                price = price[0].cash;
            }else{
                price = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashCar: price}}, {upsert: true});
            await db.collection('cashes').updateOne({}, {$set: {cash: price}}, {upsert: true});
        }catch(err){
            cb({status:500, msg: 'Касса не обновлена!'});
        }
    });

    //Сохранение чая
    socket.on('saveTea', async (data, cb) => {
        try{
            await db.collection('teas').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {costs: data}}, {upsert: true});

            let price = await db.collection('teas').aggregate([
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
            if(price.length){
                price = -price[0].cash;
            }else{
                price = 0;
            }

            let dataPrice = 0;
            data.forEach(function (item)  {
                dataPrice += item.price * item.quantity;
            });
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashTea: price}}, {upsert: true});
            await db.collection('cashes').updateOne({}, {$inc: {cash: -dataPrice}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:200, msg: err});
        }
    });

    //Редактирование чая
    socket.on('redactorTea', async (data, cb) => {
        try{
            await db.collection('teas').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {costs: data}});

            let price = await db.collection('teas').aggregate([
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
            if(price.length){
                price = -price[0].cash;
            }else{
                price = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashTea: price}}, {upsert: true});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Сохранение кофе
    socket.on('saveCoffee', async (data, cb) => {
        try{
            await db.collection('coffees').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), costs: data}}, {upsert: true});
            let price = await db.collection('coffees').aggregate([
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
            if(price.length){
                price = -price[0].cash;
            }else{
                price = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashCoffee: price}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Редактирование Кофе
    socket.on('redactorCoffee', async (data, cb) => {
        try{
            await db.collection('coffees').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {costs: data}});

            let price = await db.collection('coffees').aggregate([
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
            if(price.length){
                price = -price[0].cash;
            }else{
                price = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashCoffee: price}}, {upsert: true});
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashCoffeeMachine: price[0].cash}}, {upsert: true});
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

    //Админка удаление
    socket.on('delete', async (collection, id, cb) => {
        try{
            await db.collection(collection).removeOne({_id: ObjectId(id)});
            cb({status:200, msg: 'Удалено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Админка удаление услуг
    socket.on('deleteNameService', async (collection, name, type, cb) => {
        try{
            await db.collection(collection).updateOne({name: type}, {$pull: {service: {name: name}}});
            cb({status:200, msg: 'Удалено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Админка Сохранение полей услуг
    socket.on('saveField', async (collection,type, data, cb) => {
        try{
            console.log(data);
            await db.collection(collection).updateOne({name: type}, {$addToSet: {service: data}});
            cb({status:200, msg: 'Добавлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Админка Обновление типа авто
    socket.on('updateType', async (collection, id, name, cb) => {
        try{
            await db.collection(collection).updateOne({_id: ObjectId(id)}, {$set: {name: name}});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Админка Обновление полей услуг
    socket.on('updateFiled', async (type, index, data, cb) => {
        try{
            await db.collection('services').updateOne({name: type, "service.name":  data.name}, {$set: {'service.$': data}});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Админка Добавление типа авто
    socket.on('addTypeAuto', async (collection, data, cb) => {
        try{
            await db.collection(collection).insert(data);
            cb({status:200, msg: 'Добавлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Получить все деньги которые заработал определнный мойщик от начала месяца
    socket.on('getCash', async (person, cb) => {
        try{
            let date = getMonthDateRange(moment().year(), moment().month());
            console.log(date.start.toDate());
            let cash = await db.collection('boxes').aggregate(
                {
                    $match: {washer: person, dateD: {$gte: date.start.toDate(), $lte: date.end.toDate()}}
                },
                {
                    $project: {_id: 0, cash: {$sum: ['$mainPrice', '$dopPrice']}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                }).toArray();
            if(cash.length){
                cash = cash[0].cash
            }else{
                cash = 0;
            }
            cb({status:200, msg: 'Добавлено!', cash: cash});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    function getMonthDateRange(year, month) {
        let startDate = moment([year, month]);
        let endDate = moment(startDate).endOf('month');
        return { start: startDate, end: endDate };
    }

    //При клике на кнопку выдать аванс
    socket.on('cashPrepaid', async (person, cb) => {
        try{
            let date = getMonthDateRange(moment().year(), moment().month());
            let cash = await db.collection('boxes').aggregate(
                {
                    $match: {washer: person, dateD: {$gte: date.start.toDate(), $lte: date.end.toDate()}}
                },
                {
                    $project: {_id: 0, cash: {$sum: ['$mainPrice', '$dopPrice']}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                }).toArray();
            if(cash.length){
                cash = cash[0].cash;
                cash = -((30 * cash)/100);
                let id = await db.collection('prepaides').insert({person: person, date: moment().format('DD.MM.YYYY'), dateD: new Date(), prepaid: Math.round(-cash)});
                let cashReal = await db.collection('prepaides').aggregate([
                    {
                        $match: {date: moment().format('DD.MM.YYYY')}
                    },
                    {
                        $group: {_id: null, cash: {$sum: '$prepaid'}}
                    }
                    ]).toArray();
                if(cashReal.length){
                    cashReal = -cashReal[0].cash;
                }else{
                    cashReal = 0;
                }
                await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashPrepaid: cashReal}});
                cb({status:200, msg: 'Добавлено!', cash: cash, id: id});
            }
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Удаление Аванс
    socket.on('delPrepaid', async (query, cb) => {
       try{
           query._id = ObjectId(query._id);
           await db.collection('prepaides').removeOne(query);
           let cashReal = await db.collection('prepaides').aggregate([
               {
                   $match: {date: moment().format('DD.MM.YYYY')}
               },
               {
                   $group: {_id: null, cash: {$sum: '$prepaid'}}
               }
           ]).toArray();
           if(cashReal.length){
               cashReal = -cashReal[0].cash;
           }else{
               cashReal = 0;
           }
           await db.collection('cashboxes').updateOne({date: query.date}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashPrepaid: cashReal}});
           cb({status:200, msg: 'Удалено!'});
       }catch(err){
           cb({status:500, msg: err});
       }
    });

    //Аванс по дате
    socket.on('getPrepDate', async (startDate, endDate, cb) => {
       try{
           let start = moment(startDate).toDate();
           let end =  moment(endDate).toDate();
           let data = await db.collection('prepaides').find({dateD: {$gte: start, $lte: end}}).toArray();
           cb({status:200, msg: 'Найдено!', arr: data});
       }catch(err){
           cb({status:500, msg: err});
       }
    });

    //Штраф персоналу
    socket.on('personFine', async (data, cb) => {
        try{
            data.date = moment().format('DD.MM.YYYY');
            data.dateD = new Date();
            let id = await db.collection('fines').insert(data);
            let cashFine = await db.collection('fines').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $group: {_id: null, cash: {$sum: '$fine'}}
                }
            ]).toArray();
            if(cashFine.length){
                cashFine = -cashFine[0].cash;
            }else{
                cashFine = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashFine: cashFine}}, {upsert:true});
            cb({status:200, msg: 'Штраф добавлен!', id: id});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //удаление штрафа
    socket.on('delFine', async (data, cb) => {
        try{
            await db.collection('fines').removeOne({_id: ObjectId(data)});
            let cashFine = await db.collection('fines').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $group: {_id: null, cash: {$sum: '$fine'}}
                }
            ]).toArray();
            if(cashFine.length){
                cashFine = -cashFine[0].cash;
            }else{
                cashFine = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashFine: cashFine}});
            cb({status:200, msg: 'Штраф удален!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Штраф по дате
    socket.on('getFineDate', async (startDate, endDate, cb) => {
        try{
            let start = moment(startDate).toDate();
            let end =  moment(endDate).toDate();
            let data = await db.collection('fines').find({dateD: {$gte: start, $lte: end}}).toArray();
            cb({status:200, msg: 'Найдено!', arr: data});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Save add Costs
    socket.on('saveAddCosts', async (data, cb) => {
        try{
            let id = await db.collection('productsMain').insert(data);
            cb({status:200, msg: 'Добавлено!', id: id});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //del add Costs
    socket.on('delAddCosts', async (data, cb) => {
        try{
            await db.collection('productsMain').removeOne({_id: ObjectId(data)});
            cb({status:200, msg: 'Удалено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //redact add Costs
    socket.on('redactAddCosts', async (data, query, cb) => {
        try{
            query = {_id: ObjectId(query)};
            await db.collection('productsMain').updateOne(query, {$set: data});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Save add Dops
    socket.on('saveAddDops', async (data, cb) => {
        try{
            let id = await db.collection('productsDop').insert(data);
            cb({status:200, msg: 'Добавлено!', id: id});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //del add Dops
    socket.on('delAddDops', async (data, cb) => {
        try{
            await db.collection('productsDop').removeOne({_id: ObjectId(data)});
            cb({status:200, msg: 'Удалено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //redact add Dops
    socket.on('redactAddDops', async (data, query, cb) => {
        try{
            query = {_id: ObjectId(query)};
            await db.collection('productsDop').updateOne(query, {$set: data});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //save add Score
    socket.on('saveDopScore', async (data, cb) => {
        try{
            let id = await db.collection('products').insert(data);
            console.log(123);
            let cash = await db.collection('products').aggregate([
                {
                    $project: {_id: 0, cash: {$sum: {$multiply: ['$salePrice', '$warehouse']}}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                }
            ]).toArray();
            if(cash.length){
                cash = -cash[0].cash;
            }else{
                cash = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashStore: cash}}, {upsert: true});
            cb({status:200, msg: 'Добавлено!', id: id});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //del add Score
    socket.on('delAddScore', async (data, cb) => {
        try{
            await db.collection('products').removeOne({_id: ObjectId(data)});
            let cash = await db.collection('products').aggregate([
                {
                    $project: {_id: 0, cash: {$sum: {$multiply: ['$salePrice', '$warehouse']}}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                }
            ]).toArray();
            if(cash.length){
                cash = -cash[0].cash;
            }else{
                cash = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashStore: cash}}, {upsert: true});
            cb({status:200, msg: 'Удалено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //redact add Score
    socket.on('redactAddScore', async (data, query, cb) => {
        try{
            query = {_id: ObjectId(query)};
            await db.collection('products').updateOne(query, {$set: data});
            let cash = await db.collection('products').aggregate([
                {
                    $project: {_id: 0, cash: {$sum: {$multiply: ['$salePrice', '$warehouse']}}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                }
            ]).toArray();
            if(cash.length){
                cash = -cash[0].cash;
            }else{
                cash = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashStore: cash}}, {upsert: true});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });
};