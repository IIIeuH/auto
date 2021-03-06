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
            let res =await db.collection('boxes').insert(data);
            cb({status:200, msg: 'Услуги сохранены!', id: res.insertedIds[0]});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //save dopServices
    socket.on('saveDopServices', async (data, query, cb) => {
        try{
            await db.collection('boxes').updateOne({_id: ObjectId(query)}, {$set: {dopServices: data.services, dopPrice:  data.price, dopTime: data.time}, $inc: {price: data.price, time: data.time}});
            cb({status:200, msg: 'Доп. услуги сохранены!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //save redactServices
    socket.on('saveRedactServices', async (data, query, cb) => {
        try{
            if(!data.vip) {
                await db.collection('boxes').updateOne(query, {$set: {services: data.services, mainPrice:  data.price, mainTime: data.time}});
            }
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
    socket.on('setStatus', async (id, status, cb) => {
        try{
            await db.collection('boxes').updateOne({_id: ObjectId(id)}, {$set: {status: status}});
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

    socket.on('setCosts', async (data,name, cash, person,admin, vip, vipId, cb) => {
        try{
            if(data.length){
                let spisanie = data.map( async(item) =>{
                    await db.collection('products').updateOne({name: item.name}, {$set: {warehouse: item.remainder}});
                });

                Promise.all(spisanie).then( async()=>{
                    await db.collection('scores').insertOne({date: moment().format('DD.MM.YYYY'), costs: data,name: name, noCashe: cash, person: person, admin: admin, dateD: new Date(), vip:vip});
                    if(vip){
                        let balance = data.reduce( (accum, item) => accum + (item.price * item.quantity), 0);
                        console.log(balance);
                        await db.collection('clients').updateOne({_id: ObjectId(vipId)}, {$inc: {balance: -balance}});
                        cb({status:200, msg: 'Сохранено!'});
                    }
                    if(!cash && !person && !vip){
                        let price = await db.collection('scores').aggregate([
                            {
                                $match: {date: moment().format('DD.MM.YYYY'), noCashe: cash, person: person}
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
                    }
                    if(cash && !vip){
                        let price = await db.collection('scores').aggregate([
                            {
                                $match: {date: moment().format('DD.MM.YYYY'), noCashe: true}
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
                        await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), noCashScore: price}}, {upsert: true});
                        cb({status:200, msg: 'Сохранено!'});
                    }

                    if(person && !vip){
                        // let price = await db.collection('scores').aggregate([
                        //     {
                        //         $match: {date: moment().format('DD.MM.YYYY'), person: true}
                        //     },
                        //     {
                        //         $unwind: "$costs"
                        //     },
                        //     {
                        //         $project: {_id: 0, cash: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
                        //     },
                        //     {
                        //         $group: {_id: null, cash: {$sum: '$cash'}}
                        //     }
                        // ]).toArray();
                        // if(price.length){
                        //     price = price[0].cash;
                        // }else{
                        //     price = 0;
                        // }
                        // await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), personCasheScore: -price}}, {upsert: true});
                        cb({status:200, msg: 'Сохранено!'});
                    }
                });
            }
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    socket.on('saveProductDop', async (data,name, cb) => {
        try{
            await db.collection('dops').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), costs: data, dateD: new Date() } }, {upsert: true});
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

    socket.on('saveProductMain', async (data,name,  cb) => {
        try{
            await db.collection('costs').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {name: name, costs: data, dateD: new Date()} }, {upsert: true});
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

    //Save arbitrary
    socket.on('saveArbitrary', async (data,name,  cb) => {
        try{
            await db.collection('arbitrarys').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {name: name, costs: data, dateD: new Date()} }, {upsert: true});
            let price = await db.collection('arbitrarys').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $unwind: "$costs"
                },
                {
                    $group: {_id: null, cash: {$sum: '$costs.price'}}
                }
            ]).toArray();
            if(price.length){
                price = -price[0].cash;
            }else{
                price = 0;
            }
            let res = await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), arbitrary: price}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!', arr: res});
        }catch(err){
            cb({status:500, msg: err});
        }
    });



    //Цена в кассе
    socket.on('cachbox', async (cb) =>{
        try{
            let price = await db.collection('boxes').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY'), vip: false, nonCash: false}
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

            let nonprice = await db.collection('boxes').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY'), vip: false, nonCash: true}
                },
                {
                    $project: {_id: 0, cash: {$sum: ['$mainPrice', '$dopPrice']}}
                },
                {
                    $group: {_id: null, cash: {$sum: '$cash'}}
                }
            ]).toArray();
            if(nonprice.length){
                nonprice = nonprice[0].cash;
            }else{
                nonprice = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), nonCashCar: nonprice}}, {upsert: true});
        }catch(err){
            cb({status:500, msg: 'Касса не обновлена!'});
        }
    });



    //Отметkа безнал
    socket.on('getNonCash', async (id, flag, cb) =>{
        try{
            await db.collection('boxes').updateOne({_id: ObjectId(id)}, {$set: {nonCash: flag}})
            cb({status:200, msg: 'Обновлено!'})
        }catch(err){
            cb({status:500, msg: 'Ошибка сохранения!'});
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
                    $project: {_id: 0, cash: {$multiply : [{$subtract: ['$endCoffee', '$startCoffee']}, 100]}}
                }
            ]).toArray();
            if(price.length){
                price = price[0].cash;
            }else{
                price = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashCoffeeMachine: price}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Сохранение персонала
    socket.on('savePersons', async(data, cb) => {
       try{
           let id = await db.collection('persons').insertOne(data);
           cb({status:200, msg: 'Сохранено!' , id: id.insertedId});
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
            let id = await db.collection('marks').insertOne(data);
            cb({status:200, msg: 'Сохранено!', id: id.insertedId});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Удаление марок
    socket.on('delMarks', async(id, cb) => {
        try{
            await db.collection('marks').removeOne({_id: ObjectId(id)});
            cb({status:200, msg: 'Удалено!'});
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
           let number = await db.collection('clients').find({number: {$regex: data}}).toArray();
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
                await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashPrepaid: cashReal}}, {upsert: true});
                cb({status:200, msg: 'Добавлено!', cash: cash, id: id});
            }
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //При клике на кнопку выдать ежедневный аванс
    socket.on('cashPrepaidDay', async (person, cash, cb) => {
        try{
            let id = await db.collection('prepaides').insert({person: person, date: moment().format('DD.MM.YYYY'), dateD: new Date(), prepaid: Math.round(cash)});
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashPrepaid: cashReal}}, {upsert: true});
            cb({status:200, msg: 'Добавлено!', cash: cash, id: id});
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
           await db.collection('cashboxes').updateOne({date: query.date}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashPrepaid: cashReal}}, {upsert: true});
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



    //Премия персонала
    //Штраф персоналу
    socket.on('personPrize', async (data, cb) => {
        try{
            data.date = moment().format('DD.MM.YYYY');
            data.dateD = new Date();
            let id = await db.collection('prizes').insert(data);
            let cashPrize = await db.collection('prizes').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $group: {_id: null, cash: {$sum: '$prize'}}
                }
            ]).toArray();
            if(cashPrize.length){
                cashPrize = -cashPrize[0].cash;
            }else{
                cashPrize = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashPrize: cashPrize}}, {upsert:true});
            cb({status:200, msg: 'Премия добавлена!', id: id});
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
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashFine: cashFine}}, {upsert: true});
            cb({status:200, msg: 'Штраф удален!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //удаление Премии
    socket.on('delPrize', async (data, cb) => {
        try{
            await db.collection('prizes').removeOne({_id: ObjectId(data)});
            let cashPrize = await db.collection('prizes').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $group: {_id: null, cash: {$sum: '$prize'}}
                }
            ]).toArray();
            if(cashPrize.length){
                cashPrize = -cashPrize[0].cash;
            }else{
                cashPrize = 0;
            }
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), cashPrize: cashPrize}}, {upsert: true});
            cb({status:200, msg: 'Премия удалена!'});
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



    //Премия по дате
    socket.on('getPrizeDate', async (startDate, endDate, cb) => {
        try{
            let start = moment(startDate).toDate();
            let end =  moment(endDate).toDate();
            let data = await db.collection('prizes').find({dateD: {$gte: start, $lte: end}}).toArray();
            cb({status:200, msg: 'Найдено!', arr: data});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Касса по дате
    socket.on('getCashboxDate', async (startDate, endDate, cb) => {
        try{
            let start = moment(startDate).toDate();
            let end =  moment(endDate).toDate();
            let data = await db.collection('cashboxes').find({dateD: {$gte: start, $lte: end}}).toArray();
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

    //del Persons
    socket.on('delPersons', async (data, cb) => {
        try{
            await db.collection('persons').removeOne({_id: ObjectId(data)});
            cb({status:200, msg: 'Удалено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //administrator Persons
    socket.on('administrPersons', async (data, cb) => {
        try{
            await db.collection('persons').updateOne({_id: ObjectId(data)}, {$set: {administrator: true}});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //del administrator Persons
    socket.on('delAdministrPersons', async (data, cb) => {
        try{
            await db.collection('persons').updateOne({_id: ObjectId(data)}, {$set: {administrator: false}});
            cb({status:200, msg: 'Обновлено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //График работ по дате
    socket.on('getJobDate', async (startDate, endDate, cb) => {
        try{
            let start = moment(startDate).startOf('day').toDate();
            let end =  moment(endDate).endOf('day').toDate();
            console.log(start, end);
            let data = await db.collection('boxes').find({dateD: {$gte: start, $lte: end}, status: "ready"}, {date: 1, administrator: 1, washer: 1, services: 1, mainPrice: 1, dopServices: 1, dopPrice: 1, number: 1, car: 1}).toArray();
            cb({status:200, msg: 'Найдено!', arr: data});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //инкассация
    socket.on('saveEncashmanet', async (val, cb) => {
        try{
            await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {date: moment().format('DD.MM.YYYY'), dateD: new Date(), encashment: +val}}, {upsert: true});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Списание денег у вип клиента при нажатии на кнопку готово
    socket.on('cashVIP', async (number, car, price, cb) => {
        try{
            let balance = await db.collection('clients').findOne({number: number, marka: car}, {balance: 1});
            if(+balance.balance <  +price){
                cb({status:500, msg: 'У клиента не достаточно средств! Баланс клиента составляет: ' + balance.balance + 'руб.'});
            }else{
                let res = +balance.balance - +price;
                await db.collection('clients').updateOne({number: number, marka: car}, {$set: {balance: res}});
                cb({status:200, msg: 'Сохранено!'});
            }
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //проверка денег у VIP перед заездом
    socket.on('chackCashVIP', async (number, car, price, cb) => {
        try{
            let balance = await db.collection('clients').findOne({number: number, marka: car}, {balance: 1});
            if(+balance.balance <  +price){
                cb({status:500, msg: 'У клиента не достаточно средств! Баланс клиента составляет: ' + balance.balance + 'руб.'});
            }else{
                cb({status:200});
            }
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Часть оплаты на карту
    socket.on('savePartNoCash', async (data, cb) => {
        try{
            await db.collection('boxes').updateOne({_id: ObjectId(data.id)}, {$set: {partNoCash: data.price}});
            let partCashToDay = await db.collection('boxes').aggregate([
                {
                  $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $group: {_id: null, part: {$sum: '$partNoCash'}}
                }
            ]).toArray();
            if(partCashToDay[0].hasOwnProperty('part')){
                await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {partencashment: partCashToDay[0].part}});
            }else{
                throw ('Инкассация не обновлена!');
            }
            cb({status:200, msg: 'Обновлено'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Отложенная оплата
    socket.on('deferCash', async (data, cb) => {
        try{
            await db.collection('boxes').updateOne({_id: ObjectId(data.id)}, {$set: {deferCash: data.val}});
            if(data.val){
                await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$inc: {deferCash: -data.price}});
            }else{
                await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$inc: {deferCash: data.price}});
            }
            cb({status:200, msg: 'Обновлено'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Подтверждение отложенной оплаты
    socket.on('statusDefer', async (data, cb) => {
        try{
            await db.collection('boxes').updateOne({_id: ObjectId(data.id)}, {$set: {deferCash: false}});
            await db.collection('cashboxes').updateOne({date: data.date}, {$inc: {deferCash: data.price}});
            cb({status:200, msg: 'Обновлено'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Save discount
    socket.on('saveDiscount', async (data, cb) => {
        try{
            await db.collection('boxes').updateOne({_id: ObjectId(data.id)}, {$set: {discount: data.discount}});
            let discount = await db.collection('boxes').aggregate([
                {
                    $match: {date: moment().format('DD.MM.YYYY')}
                },
                {
                    $group: {_id: null, discount: {$sum: '$discount'}}
                }
            ]).toArray();
            if(discount[0].hasOwnProperty('discount')){
                await db.collection('cashboxes').updateOne({date: moment().format('DD.MM.YYYY')}, {$set: {discountCash: -discount[0].discount}});
            }else{
                throw ('Скидка не обновлена!');
            }
            cb({status:200, msg: 'Обновлено'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });


    //Report по дате
    socket.on('getReportDate', async (startDate, endDate, cb) => {
        try{
            let start = moment(startDate, 'YYYY-MM-DD').startOf('day').toDate();
            let end =  moment(endDate, 'YYYY-MM-DD').endOf('day').toDate();



            let data = {};
            data.washers = await db.collection('persons').find({administrator: false}, {_id: 0, administrator: 0}).toArray();

            let carPromise = data.washers.map( async (item) => {
                return db.collection('boxes').count({washer: item.fio, status: 'ready', dateD: {$gte: start, $lte: end}});
            });

            data.cars = await Promise.all(carPromise);

            let sumPromise = data.washers.map( (item) => {
                return db.collection('boxes').aggregate(
                    {
                        $match: {washer: item.fio, status: 'ready', dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $project: {_id: 0, sum: {$sum: ['$mainPrice', '$dopPrice']}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.sum = await Promise.all(sumPromise);

            data.sumArr = data.sum.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });

            let mainCostsPromise = data.washers.map( (item) => {
                return db.collection('costs').aggregate(
                    {
                        $match: {name: item.fio, dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $unwind: "$costs"
                    },
                    {
                        $project: {_id: 0, sum: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.costs = await Promise.all(mainCostsPromise);

            data.costsArr = data.costs.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });


            let dopCostsPromise = data.washers.map( (item) => {
                return db.collection('dops').aggregate(
                    {
                        $match: {name: item.fio, dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $unwind: "$costs"
                    },
                    {
                        $project: {_id: 0, sum: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.dopCosts = await Promise.all(dopCostsPromise);

            data.dopCostsArr = data.dopCosts.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });



            let arbitrarysPromise = data.washers.map( (item) => {
                return db.collection('arbitrarys').aggregate(
                    {
                        $match: {name: item.fio, dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $unwind: "$costs"
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$costs.price'}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.arbitrars = await Promise.all(arbitrarysPromise);

            data.arbitrarsArr = data.arbitrars.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });


            let discountPromise = data.washers.map( (item) => {
                return db.collection('boxes').aggregate(
                    {
                        $match: {washer: item.fio, status: 'ready', dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$discount'}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.discount = await Promise.all(discountPromise);


            data.discountArr = data.discount.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });


            let scoresPromise = data.washers.map( (item) => {
                return db.collection('scores').aggregate(
                    {
                        $match: {name: item.fio, dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $unwind: "$costs"
                    },
                    {
                        $group: {_id: null, sum: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.scores = await Promise.all(scoresPromise);


            data.scoresArr = data.scores.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });


            let scoresNoCashePromise = data.washers.map( (item) => {
                return db.collection('scores').aggregate(
                    {
                        $match: {name: item.fio, dateD: {$gte: start, $lte: end}, noCashe: true}
                    },
                    {
                        $unwind: "$costs"
                    },
                    {
                        $group: {_id: null, sum: {$sum: {$multiply: ['$costs.price', '$costs.quantity']}}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.scoresNoCashe = await Promise.all(scoresNoCashePromise);

            data.scoresNoCasheArr = data.scoresNoCashe.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });

            let cardPromise = data.washers.map( (item) => {
                return db.collection('boxes').aggregate(
                    {
                        $match: {washer: item.fio, nonCash: true, status: 'ready', dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $project: {_id: null, sum: {$sum: ['$mainPrice', '$dopPrice']}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.cards = await Promise.all(cardPromise);

            data.cardsArr = data.cards.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });

            let deferPromise = data.washers.map( (item) => {
                return db.collection('boxes').aggregate(
                    {
                        $match: {washer: item.fio, deferCash: true, status: 'ready', dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $project: {_id: null, sum: {$sum: ['$mainPrice', '$dopPrice']}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.deferCash = await Promise.all(deferPromise);


            data.deferCashArr = data.deferCash.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });


            let vipPromise = data.washers.map( (item) => {
                return db.collection('boxes').aggregate(
                    {
                        $match: {washer: item.fio, vip: true, status: 'ready', dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $project: {_id: null, sum: {$sum: ['$mainPrice', '$dopPrice']}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.vip = await Promise.all(vipPromise);

            data.vipArr = data.vip.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });

            let prevDeferCashPromise = data.washers.map( (item) => {
                return db.collection('boxes').aggregate(
                    {
                        $match: {washer: item.fio, deferCash: false, status: 'ready', dateD: {$gte: start, $lte: end}}
                    },
                    {
                        $project: {_id: null, sum: {$sum: ['$mainPrice', '$dopPrice']}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    },
                    {
                        $group: {_id: null, sum: {$sum: '$sum'}}
                    }).toArray();
            });

            data.prevDeferCash = await Promise.all(prevDeferCashPromise);

            data.prevDeferCashArr = data.prevDeferCash.map((item) => {
                if(item[0]){
                    return item[0].sum;
                }else{
                    return 0;
                }
            });


            data.cashboxAll = await db.collection('cashboxes').aggregate(
                {
                    $match: {dateD: {$gte: start, $lte: end}}
                },
                {
                    $project: {_id: null, prepaid: {$sum: ['$cashPrepaid']}, coffee: {$sum: ['$cashCoffeeMachine']}, tea: {$sum: ['$cashTea']}, coffeeT: {$sum: ['$cashCoffee']}, all: {$sum: ['$encashment', '$cashPrepaid', '$cashCar', '$discountCash', '$cashCosts', '$cashDops', '$arbitrary', '$cashScore', '$cashCoffeeMachine', '$deferCash', '$cashTea']}}
                },
                {
                    $group: {_id: null, all: {$sum: ['$all']}}
                }).toArray();

            let vipSum = 0;
            data.vip.forEach((item) =>{
                if(item.length){
                    vipSum += item[0].sum;
                }
            });


            if(data.cashboxAll.length){
                let p = 0;
                data.cashbox = data.cashboxAll.reduce((accum, current) =>{
                    return accum + current.all;
                }, p);
                data.prepaid = data.cashboxAll.reduce((accum, current) =>{
                    return accum + current.prepaid;
                }, p);
                data.coffee = data.cashboxAll.reduce((accum, current) =>{
                    return accum + current.coffee;
                }, p);
                data.tea = data.cashboxAll.reduce((accum, current) =>{
                    return accum + current.tea;
                }, p);
                data.coffeeT = data.cashboxAll.reduce((accum, current) =>{
                    return accum + current.coffeeT;
                }, p);
            }else{
                data.cashbox = 0;
            }
            data.cashbox -= vipSum;


            cb({status:200, msg: 'Найдено!', arr: data});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Смена боксов
    socket.on('changeBox', async (data, cb) => {
        try{
            await db.collection('boxes').update({_id: ObjectId(data._id)}, {$set: {box: data.box}});
            cb({status:200, msg: 'Бокс изменен!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Смена washer
    socket.on('changeWasher', async (data, cb) => {
        try{
            await db.collection('boxes').update({_id: ObjectId(data._id)}, {$set: {washer: data.washer}});
            cb({status:200, msg: 'Сохранено!'});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //отчет магазина
    socket.on('getReportScore', async (start, end, admin, cb) => {
        try{
            let res =  await db.collection('scores').aggregate(
                {
                    $match: {dateD: {$gte: new Date(moment(start).startOf('day')), $lte: new Date(moment(end).endOf('day'))}, admin: admin}
                },
                {
                    $unwind: "$costs"
                },
                {
                    $project: {_id: 0, name: '$costs.name', count: '$costs.quantity', price: '$costs.price', date: 1}
                },
                {
                    $group: {_id: '$costs.name', count: '$costs.quantity', price: '$costs.price'}
                }).toArray();
            cb({status:200, result: res});
        }catch(err){
            cb({status:500, msg: err});
        }
    });

    //Зп мойщика
    socket.on('getSalaryWasher', async (data, cb) => {
        try{
            let start = new Date(moment(data.start, "YYYY-MM-DD").startOf('week'));
            let end = new Date(moment(data.start, "YYYY-MM-DD").endOf('week'));

            let washers = await db.collection('persons').distinct('fio', {administrator: false});

            let result = washers.map( async(item, i) =>{
                let obj = {
                    washer: item
                };
                let price = await db.collection('boxes').find({dateD: {$gte: start, $lte: end}, status: 'ready', washer: item}, {mainPrice:1, dopPrice: 1, _id: 0}).toArray();

                let sum = 0;
                if(price.length){
                    price.forEach( (o) => {
                        sum += o.mainPrice + o.dopPrice;
                    });
                }else{
                    sum = 0;
                }

                obj.price = sum * 0.3;

                let fine = await db.collection('fines').find({dateD: {$gte: start, $lte: end}, person: item}, {fine:1, _id: 0}).toArray();

                let fineSum = 0;

                if(fine.length){
                    fine.forEach( (o) => {
                        fineSum += o.fine;
                    });
                }else{
                    fineSum = 0;
                }

                obj.fine = fineSum;

                let score = await db.collection('scores').find({dateD: {$gte: start, $lte: end}, name: item, person: true}, {costs:1, _id: 0}).toArray();

                let scoreSum = 0;
                if(score.length){
                    score.forEach( (o) =>{
                        if(o.costs.length){
                            o.costs.forEach( (item) =>{
                                scoreSum += item.price * item.quantity;
                            })
                        }
                    });
                }

                obj.score = scoreSum;


                let prepaid = await db.collection('prepaides').find({dateD: {$gte: start, $lte: end}, person: item}, {prepaid:1, _id: 0}).toArray();

                let prepaidSum = 0;

                if(prepaid.length){
                    prepaid.forEach( (o) => {
                        prepaidSum += o.prepaid;
                    });
                }else{
                    prepaidSum = 0;
                }

                obj.prepaid = prepaidSum;

                obj.sum = obj.price - obj.fine - obj.score - obj.prepaid;
                return obj;
            });
            Promise.all(result).then( (data) =>{
                cb({status:200, wash: data});
            });
        }catch(err){
            console.log(err);
            cb({status:500, msg: err});
        }
    });


    //Зп администратора
    socket.on('getSalaryAdministrator', async (data, cb) => {
        try{
            let start = new Date(moment(data.start, "YYYY-MM-DD").startOf('week'));
            let end = new Date(moment(data.start, "YYYY-MM-DD").endOf('week'));

            let admins = await db.collection('persons').distinct('fio', {administrator: true});

            let result = admins.map( async(item, i) =>{
                let obj = {
                    admin: item
                };
                let price = await db.collection('boxes').find({dateD: {$gte: start, $lte: end}, status: 'ready'}, {mainPrice:1, dopPrice: 1, _id: 0}).toArray();

                let sum = 0;
                if(price.length){
                    price.forEach( (o) => {
                        sum += o.mainPrice + o.dopPrice;
                    });
                }else{
                    sum = 0;
                }

                obj.price = sum * 0.1;

                let fine = await db.collection('fines').find({dateD: {$gte: start, $lte: end}, person: item}, {fine:1, _id: 0}).toArray();

                let fineSum = 0;

                if(fine.length){
                    fine.forEach( (o) => {
                        fineSum += o.fine;
                    });
                }else{
                    fineSum = 0;
                }

                obj.fine = fineSum;

                let score = await db.collection('scores').find({dateD: {$gte: start, $lte: end}, name: item, person: true}, {costs:1, _id: 0}).toArray();

                let scoreSum = 0;
                if(score.length){
                    score.forEach( (o) =>{
                        if(o.costs.length){
                            o.costs.forEach( (item) =>{
                                scoreSum += item.price * item.quantity;
                            })
                        }
                    });
                }

                obj.score = scoreSum;


                let prepaid = await db.collection('prepaides').find({dateD: {$gte: start, $lte: end}, person: item}, {prepaid:1, _id: 0}).toArray();

                let prepaidSum = 0;

                if(prepaid.length){
                    prepaid.forEach( (o) => {
                        prepaidSum += o.prepaid;
                    });
                }else{
                    prepaidSum = 0;
                }

                obj.prepaid = prepaidSum;

                obj.sum = obj.price - obj.fine - obj.score - obj.prepaid;
                return obj;
            });
            Promise.all(result).then( (data) =>{
                cb({status:200, admin: data});
            });
        }catch(err){
            cb({status:500, msg: err});
        }
    });

};
