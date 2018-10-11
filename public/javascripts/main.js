'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    socket.on('connect', function() {
    });


    var administrator = get_cookie('administrator');
    if(administrator && administrator !== ''){
    }else{
        $('.modal').modal('show')
    }

    $(document).on('click', '#saveAdministrator', function(){
        let admin = $('.check-admin').val();
        document.cookie = "administrator="+admin;
        $('.modal').modal('hide')
    });


    statusColor();
    btnActive();
    service();
    serviceReady();
    checkService();
    setService();
    save();
    del();
    statusBtnWash();
    statusBtnReady();
    statusBtnAwait();
    statusBox();
    timerService();
    dopAllCar();
    allCar();
    dopService();
    redactService();
    autoNumber();
    $(document).on('click', '#print', function () {
        window.print();
    });
    nonСash();
    partnocash();
    deferCash();
    let washerSelect = get_cookie('washer');
    if(washerSelect){
        $('#washer').val(get_cookie('washer'));
    }
    discount();

});

function get_cookie ( cookie_name )
{
    var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

    if ( results )
        return ( results[2]);
    else
        return null;
}

function isEmpty(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}


//получение все услуг при клике на тип авто
function setService(){
    socket.on('setService', function(data){
        var el = $('.set-service');
        el.empty();
        data.forEach( (item) => {
            item['service'].forEach( (service) => {
                el.append('<div class="d-inline-flex p-2 service" data-price="'+service.price+'" data-time="'+ service.time +'">'+service.name+'</div>')
            });
        })
    });
}


//получение доп услуг при клике на тип авто
function setDopService(typeAuto){
    socket.emit('setDopServiceTypeAuto', typeAuto);
    socket.on('setDopService', function(data){
        var el = $('.set-dop-service');
        el.empty();
        data.forEach( (item) => {
            item['service'].forEach( (service) => {
                el.append('<div class="d-inline-flex p-2 service-dop" data-price="'+service.price+'" data-time="'+ service.time +'">'+service.name+'</div>')
            });
        })
    });
}

//получение услуг при клике на тип авто редактирование
function setRedactService(typeAuto){
    socket.emit('setRedactServiceTypeAuto', typeAuto);
    socket.on('setRedactService', function(data){
        var el = $('.set-redact-service');
        el.empty();
        data.forEach( (item) => {
            item['service'].forEach( (service) => {
                el.append('<div class="d-inline-flex p-2 service-redact" data-price="'+service.price+'" data-time="'+ service.time +'">'+service.name+'</div>')
            });
        })
    });
}

function service(){
    $(document).on('click', '.service', function() {
        var price = 0;
        var time = 0;
        $('.redy-service').append('<div class="d-inline-flex p-2 service-ready" data-price="'+$(this).data('price')+'" data-time="'+$(this).data('time')+'">' + $(this).text() + '</div>');
        var serviceReady = $('.service-ready');
        serviceReady.each(function(){
            price += $(this).data('price');
            time += $(this).data('time');
        });
        $('.info-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + getTimeFromMins(time));
    });
}

function dopService(){
    $(document).on('click', '.service-dop', function() {
        var price = 0;
        var time = 0;
        $('.redy-dop-service').append('<div class="d-inline-flex p-2 service-dop-ready" data-price="'+$(this).data('price')+'" data-time="'+$(this).data('time')+'">' + $(this).text() + '</div>');
        var serviceReady = $('.service-dop-ready');
        serviceReady.each(function(){
            price += $(this).data('price');
            time += $(this).data('time');
        });
        $('.info-dop-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + getTimeFromMins(time));
    });
}

function redactService(){
    $(document).on('click', '.service-redact', function() {
        var price = 0;
        var time = 0;
        $('.redy-redact-service').append('<div class="d-inline-flex p-2 service-redact-ready" data-price="'+$(this).data('price')+'" data-time="'+$(this).data('time')+'">' + $(this).text() + '</div>');
        var serviceReady = $('.service-redact-ready');
        serviceReady.each(function(){
            price += $(this).data('price');
            time += $(this).data('time');
        });
        $('.info-redact-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + getTimeFromMins(time));
    });
}

function serviceReady(){
    $(document).on('click', '.service-ready', function(){
        $(this).remove();
        var price = 0;
        var time = 0;
        var serviceReady = $('.service-ready');
        serviceReady.each(function(){
            price += $(this).data('price');
            time += $(this).data('time');
        });
        $('.info-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + getTimeFromMins(time));
    });
}

function serviceDopReady(){
    $(document).on('click', '.service-dop-ready', function(){
        $(this).remove();
        var price = 0;
        var time = 0;
        var serviceReady = $('.service-dop-ready');
        serviceReady.each(function(){
            price += $(this).data('price');
            time += $(this).data('time');
        });
        $('.info-dop-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + getTimeFromMins(time));
    });
}

function serviceRedactReady(){
    $(document).on('click', '.service-redact-ready', function(){
        $(this).remove();
        var price = 0;
        var time = 0;
        var serviceReady = $('.service-redact-ready');
        serviceReady.each(function(){
            price += $(this).data('price');
            time += $(this).data('time');
        });
        $('.info-redact-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + getTimeFromMins(time));
    });
}


//сервисы услуг передается название услуги
function checkService(){
    var el = $('.type-auto');
    el.click(function(){
        el.removeClass('activeType');
        $('.redy-service').empty();
        $('.info-service').text('Выбрано 0, Цена: 0, Время: 0');
        $(this).addClass('activeType');
        socket.emit('getService', {name: $(this).text()});
    });
}

//сервисы услуг передается название доп услуги
function checkDopService(){
    var el = $('.type-dop-auto');
    el.click(function(){
        el.removeClass('activeType');
        $('.redy-service').empty();
        $('.info-service').text('Выбрано 0, Цена: 0, Время: 0');
        $(this).addClass('activeType');
        socket.emit('getDopService', {name: $(this).text()});
    });
}

//Кнопка не активна пока не введены марка номер и мойщик
function btnActive() {
    var btn = $('#modalOne');
    var car = $('#marka');
    var number = $('#number');
    var washer = $('#washer');
    var btnSave = $('#save');
    $('.valid-btn').change(function(){
        if(car.val() === '' || number.val() === ''){
            btn.attr('disabled', 'disabled');
        }else{
            btn.removeAttr('disabled');
        }
    });

    // $(document).on('click', '#modalService', function(){
    //     var readyService = $('.service-ready');
    //     if(readyService.length){
    //         btnSave.removeAttr('disabled');
    //     }else{
    //         btnSave.attr('disabled', 'disabled');
    //     }
    // });
    $(document).on('click', '.activeType', function(){
        if($(this).hasClass('activeType')){
            btnSave.removeAttr('disabled');
        }else{
            btnSave.attr('disabled', 'disabled');
        }
    });
}

//Сохранение услуг
function save(){
    $(document).on('click', '#save', function(event){
        event.preventDefault();
        var data = {};
        var services = $('.service-ready');
        var tbody = $('.tr-body');
        data.car = $('#marka').val();
        data.number = $('#number').val();
        data.washer = $('#washer').val();
        data.services = '';
        data.price = 0;
        data.time = 0;
        services.each(function(){
            data.services += $(this).text() + '; ';
            data.price += $(this).data('price');
            data.time += $(this).data('time');
        });
        data.box = window.location.search.substr(8);
        data.date = moment().format('DD.MM.YYYY');
        data.startDay = moment().startOf('day');
        data.endDay = moment().endOf('day');
        data.status = 'await';
        data.typeAuto = $('.type-auto.activeType').text();
        data.mainPrice = data.price;
        data.mainTime = data.time;
        data.dopTime = 0;
        data.dopPrice = 0;
        data.nonCash = false;
        data.administrator = $('#administrator').val();
        document.cookie = "washer="+data.washer;
        data.client = JSON.parse(get_cookie("client")) || {};
        if($('#vip').prop('checked')){
            data.vip = true;
            socket.emit('saveServices', data, function (res) {
                if(res.status === 200){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                    tbody.append('' +
                        '<tr class="str table-warning" data-typeauto="'+data.typeAuto+'" data-vip="1" data-id="'+res.id+'">' +
                        '<td class="time" data-minutes="' +data.time +'">' +
                        getTimeFromMins(data.time)  +
                        '</td>' +
                        '<td class="car">' +
                        data.car +
                        '</td>' +
                        '<td class="number">' +
                        data.number +
                        '</td>' +
                        '<td class="service-main" data-price="'+ data.mainPrice +'" data-time="'+ data.mainTime +'">' +
                        data.services +
                        '</td>' +
                        '<td class="dop" data-price="'+ 0 +'" data-time="'+ 0 +'">' +
                        '</td>' +
                        '<td>' +
                        data.washer +
                        '</td>' +
                        '<td class="price">' +
                        data.price +
                        '</td>' +
                        '<td>' +
                        '<input class="checkbox checkbox-non-cash" type="checkbox" disabled>' +
                        '</td>' +
                        '<td class="part">' +
                        '<input class="form-control part-noCash" type="number" value="0" disabled>' +
                        '</td>' +
                        '<td class="defer">' +
                        '<input class="checkbox defer-cash" type="checkbox" disabled>' +
                        '</td>' +
                        '<td class="discount">' +
                        '<input class="checkbox checkbox-discount" type="checkbox" disabled>' +
                        '</td>' +
                        '<td class="d-flex justify-content-center">\n' +
                        '  <button type="button" class="btn btn-primary status-wash">Заехать</button>\n' +
                        '  <button type="button" class="btn btn-success status-ready">Готово</button>\n' +
                        '  <button type="button" class="btn btn-warning redact">Услуги</button>\n' +
                        '  <button type="button" class="btn btn-info modalTwo">Доп. Услуги</button>\n' +
                        '  <button type="button" class="btn btn-danger status-await">Отмена</button>\n' +
                        '  <button type="button" class="btn btn-dark delete">Удалить</button>\n' +
                        '</td>' +
                        '</i>' +
                        '</td>' +
                        '</tr>'
                    );
                    $('#modalService').modal('hide');
                    socket.emit('cachbox',function (res) {
                        if(res.status === 500){
                            Snackbar.show({
                                text: res.msg,
                                pos: 'bottom-right',
                                actionText: null
                            });
                        }
                    });
                }else{
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            });
        }else{
            data.vip = false;
            socket.emit('saveServices', data, function (res) {
                if(res.status === 200){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                    tbody.append('' +
                        '<tr class="str" data-typeauto="'+data.typeAuto+'" data-id="'+res.id+'" data-discount="'+JSON.parse(get_cookie('client')).discount+'" data-proc="'+JSON.parse(get_cookie('client')).proc+'">' +
                        '<td class="time" data-minutes="' +data.time +'">' +
                        getTimeFromMins(data.time)  +
                        '</td>' +
                        '<td class="car">' +
                        data.car +
                        '</td>' +
                        '<td class="number">' +
                        data.number +
                        '</td>' +
                        '<td class="service-main" data-price="'+ data.mainPrice +'" data-time="'+ data.mainTime +'">' +
                        data.services +
                        '</td>' +
                        '<td class="dop" data-price="'+ 0 +'" data-time="'+ 0 +'">' +
                        '</td>' +
                        '<td>' +
                        data.washer +
                        '</td>' +
                        '<td class="price">' +
                        data.price +
                        '</td>' +
                        '<td>' +
                        '<input class="checkbox checkbox-non-cash" type="checkbox">' +
                        '</td>' +
                        '<td class="part">' +
                        '<input class="form-control part-noCash" type="number" value="0">' +
                        '</td>' +
                        '<td class="defer">' +
                        '<input class="checkbox defer-cash" type="checkbox">' +
                        '</td>' +
                        '<td class="discount">' +
                        '<input class="checkbox checkbox-discount" type="checkbox">' +
                        '</td>' +
                        '<td class="d-flex justify-content-center">\n' +
                        '  <button type="button" class="btn btn-primary status-wash">Заехать</button>\n' +
                        '  <button type="button" class="btn btn-success status-ready">Готово</button>\n' +
                        '  <button type="button" class="btn btn-warning redact">Услуги</button>\n' +
                        '  <button type="button" class="btn btn-info modalTwo">Доп. Услуги</button>\n' +
                        '  <button type="button" class="btn btn-danger">Отмена</button>\n' +
                        '  <button type="button" class="btn btn-dark delete">Удалить</button>\n' +
                        '</td>' +
                        '</i>' +
                        '</td>' +
                        '</tr>'
                    );
                    $('#modalService').modal('hide');
                    $('.checkbox-discount').last().prop("disabled", isEmpty(data.client));
                    socket.emit('cachbox',function (res) {
                        if(res.status === 500){
                            Snackbar.show({
                                text: res.msg,
                                pos: 'bottom-right',
                                actionText: null
                            });
                        }
                    });
                }else{
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            });
        }
    });
}

//Сохранение доп услуг
function saveDop(tr, number, car, minutes){
    let data = {};
    let query = {};
    let services = $('.service-dop-ready');
    data.services = '';
    data.price = 0;
    data.time = 0;
    services.each(function(){
        data.services += $(this).text() + '; ';
        data.price += $(this).data('price');
        data.time += $(this).data('time');
    });
    query.number = number;
    query.car = car;
    query.date = moment().format;
    if($('#vip').prop('checked')){
        data.vip = true;
    }
    let dop = tr.find('.dop');
    let oldTime = tr.find('.time');
    let oldPrice = tr.find('.price');
    socket.emit('saveDopServices', data, tr.data("id"), function (res) {
        if(res.status === 200){
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
            oldTime.text(getTimeFromMins(tr.find('.service-main').data('time') + data.time));
            oldPrice.text(tr.find('.service-main').data('price') + data.price);
            dop.text(
                data.services
            );
            dop.data('price', data.price);
            dop.data('time', data.time);
            $('#modalDopService').modal('hide');
            socket.emit('cachbox',function (res) {
                if(res.status === 500){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            });
        }else{
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        }
    });
}

//Сохранение услуг редактирование
function saveRedact(that, number, car, minutes){
    let data = {};
    let query = {};
    let services = $('.service-redact-ready');
    data.services = '';
    data.price = 0;
    data.time = 0;
    services.each(function(){
        data.services += $(this).text() + '; ';
        data.price += $(this).data('price');
        data.time += $(this).data('time');
    });
    query.number = number;
    query.car = car;
    if($('#vip').prop('checked')){
        data.vip = true;
    }
    let serviceMain = that.parents('tr').find('.service-main');
    let oldTime = that.parents('tr').find('.time');
    let oldPrice = that.parents('tr').find('.price');
    let p = data.price + that.parents('tr').find('.dop').data('price');
    let k = data.time + that.parents('tr').find('.dop').data('time');
    socket.emit('saveRedactServices', data, query, function (res) {
        if(res.status === 200){
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
            oldTime.text(getTimeFromMins(k));
            oldPrice.text(p);
            serviceMain.text(
                data.services
            );
            serviceMain.data('price', data.price);
            serviceMain.data('time', data.time);
            $('#modalRedactService').modal('hide');
            socket.emit('cachbox',function (res) {
                if(res.status === 500){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            });
        }else{
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        }
    });
}


//delete table
function del(){
    $(document).on('click', '.delete', function () {
        var marka = $(this).parents('.str').find('.car').text();
        var number = $(this).parents('.str').find('.number').text();
        var services = $(this).parents('.str').find('.service-main').text();
        var p = confirm('Вы действительно хотите удалить машину ' + marka + ' с номером ' + number +'?');
        var that = $(this);
        if(p){
            socket.emit('delString', {car: marka, number: number, services: services}, function (res) {
                if(res.status === 200){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                    that.parents('.str').remove();
                    socket.emit('cachbox',function (res) {
                        if(res.status === 500){
                            Snackbar.show({
                                text: res.msg,
                                pos: 'bottom-right',
                                actionText: null
                            });
                        }
                    });
                }else{
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            });
        }
    });
}

//перевод минут в часы и минуты
function getTimeFromMins(mins) {
    let hours = Math.trunc(mins/60);
    let minutes = mins % 60;
    if(minutes.toString().length === 1){
        minutes = '0' + minutes;
    }
    if(hours.toString().length === 1){
        hours = '0' + hours;
    }
    return hours + ':' + minutes;
}

//цвета таблицы в зависимости от статуса
function statusColor(){
    var tr = $('.str');
    tr.each(function(){
        if ($(this).data('status') === 'wash') {
            $(this).removeClass('table-primary table-success');
            $(this).addClass('table-primary');
        }
        if ($(this).data('status') === 'ready') {
            $(this).removeClass('table-primary table-success');
            $(this).addClass('table-success');
        }
        if ($(this).data('status') === 'await') {
            $(this).removeClass('table-primary table-success');
        }
    });

}

//Если есть хоть одна машина в боксе то нельзя загнать другую
function statusBox(){
    var tr = $('.str');
    var wash = $('.status-wash');
    var ready = $('.status-ready');
    var flag = true;
    tr.each(function() {
        if ($(this).data('status') === 'wash') {
            flag = false;
        }
        if ($(this).data('status') !== 'wash') {
            $(this).find(ready).attr('disabled', 'disabled');
        } else {
            $(this).find(ready).removeAttr('disabled', 'disabled');
        }
        if(flag){
            $(this).find(wash).removeAttr('disabled', 'disabled');
        }else{
            wash.attr('disabled', 'disabled');
        }
    });
}

//Кнопка статуса wash
function statusBtnWash(){
    $(document).on('click' , '.status-wash', function(){
        var marka = $(this).parents('.str').find('.car').text();
        var number = $(this).parents('.str').find('.number').text();
        var services = $(this).parents('.str').find('.service-main').text();
        var id = $(this).parents('.str').data('id');
        var box = window.location.search.substr(8);
        var that = $(this);
        var p = confirm('Загнать машину ' + marka + ' с номером ' + number +' в бокс ' + box + '?');
        if(p){
            if(that.parents('tr').data('vip')){
                socket.emit('chackCashVIP', that.parents('.str').find('.number').text(), that.parents('.str').find('.car').text(), that.parents('.str').find('.price').text(),function (res) {
                    if(res.status === 200) {
                        socket.emit('setStatus', {car: marka, number: number, services: services, box: box}, 'wash', function (res) {
                            if(res.status === 200) {
                                Snackbar.show({
                                    text: res.msg,
                                    pos: 'bottom-right',
                                    actionText: null
                                });
                                that.parents('.str').data("status", "wash");
                                statusColor();
                                statusBox();
                            }else{
                                Snackbar.show({
                                    text: res.msg,
                                    pos: 'bottom-right',
                                    actionText: null
                                });
                            }
                        });
                    }else{
                        Snackbar.show({
                            text: res.msg,
                            pos: 'bottom-center',
                            actionText: null
                        });
                        return false
                    }
                });
            }else{
                socket.emit('setStatus', id, 'wash', function (res) {
                    if(res.status === 200) {
                        Snackbar.show({
                            text: res.msg,
                            pos: 'bottom-right',
                            actionText: null
                        });
                        that.parents('.str').data("status", "wash");
                        statusColor();
                        statusBox();
                    }else{
                        Snackbar.show({
                            text: res.msg,
                            pos: 'bottom-right',
                            actionText: null
                        });
                    }
                });
            }
        }
    });
}

function statusBtnReady(){
    $(document).on('click' , '.status-ready', function(){
        var marka = $(this).parents('.str').find('.car').text();
        var number = $(this).parents('.str').find('.number').text();
        var services = $(this).parents('.str').find('.service-main').text();
        var id = $(this).parents('.str').data('id');
        var box = window.location.search.substr(8);
        var that = $(this);
        var p = confirm('Машина ' + marka + ' с номером ' + number +' готова?');
        if(p){
            if(that.parents('tr').data('vip')){
                socket.emit('cashVIP',  that.parents('.str').find('.number').text(), that.parents('.str').find('.car').text(), that.parents('.str').find('.price').text(), function (res) {
                    if(res.status === 200) {
                        Snackbar.show({
                            text: res.msg,
                            pos: 'bottom-right',
                            actionText: null
                        });
                        socket.emit('setStatus', {car: marka, number: number, services: services, box: box}, 'ready', function (res) {
                            if(res.status === 200) {
                                Snackbar.show({
                                    text: res.msg,
                                    pos: 'bottom-right',
                                    actionText: null
                                });
                            }else{
                                Snackbar.show({
                                    text: res.msg,
                                    pos: 'bottom-right',
                                    actionText: null
                                });
                            }
                        });
                        that.parents('.str').data('status', 'ready');
                        statusColor();
                        statusBox();
                    }else{
                        Snackbar.show({
                            text: res.msg,
                            pos: 'bottom-center',
                            actionText: null
                        });
                    }
                });
            }else{
                socket.emit('setStatus', id, 'ready', function (res) {
                    if(res.status === 200) {
                        Snackbar.show({
                            text: res.msg,
                            pos: 'bottom-right',
                            actionText: null
                        });
                        that.parents('.str').data('status', 'ready');
                        statusColor();
                        statusBox();
                    }else{
                        Snackbar.show({
                            text: res.msg,
                            pos: 'bottom-right',
                            actionText: null
                        });
                    }
                });
            }
        }
    });
}

function statusBtnAwait(){
    $(document).on('click' , '.status-await', function(){
        var marka = $(this).parents('.str').find('.car').text();
        var number = $(this).parents('.str').find('.number').text();
        var services = $(this).parents('.str').find('.service-main').text();
        var id = $(this).parents('.str').data('id');
        var box = window.location.search.substr(8);
        var that = $(this);
        var p = confirm('Отменить машину ' + marka + ' с номером ' + number +'?');
        if(p){
            socket.emit('setStatus', id, 'await', function (res) {
                if(res.status === 200) {
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                    that.parents('.str').data('status', 'await');
                    statusColor();
                    statusBox();
                }else{
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            });
            socket.on('getStatus', function(){

            });
        }
    });
}

//TIMER
function timerService(){
    let tr = $('.str');
    tr.each(function(){
        let that = $(this);
        setInterval(function(){
            let time = that.find('.time').data('minutes');
            if(time === 0 || that.data('status') !== 'wash'){
                return false;
            }
            time = time -1;
            that.find('.time').data('minutes', time);
            let tim = getTimeFromMins(time);
            that.find('.time').empty();
            that.find('.time').text(tim);
        }, 1000 * 60);
    });
}

//Если доп услуги уже есть то они отображаются в модальном окне
function dopServicesReadyModal(dopServices) {
    $('.service-dop').each(function () {
        var that = $(this);
        dopServices.forEach(function (item) {
            if(item === that.text()){
                that.click();
            }
        });
    });
}

//Если услуги уже есть то они отображаются в модальном окне
function servicesReadyModal(services) {
    $('.service-redact').each(function () {
        var that = $(this);
        services.forEach(function (item) {
            if(item === that.text()){
                that.click();
            }
        });
    });
}

//Доп услуги к любой машине
function dopAllCar(){
    let that;
    let dopServices = [];
    let modal = $('#modalDopService');
    $(document).on('click', '.modalTwo', function () {
        modal.modal('show');
        setDopService($(this).parents('tr').data('typeauto'));
        serviceDopReady();
        checkDopService();
        that = $(this);
    });
    modal.on('shown.bs.modal', function (e) {
        dopServices = _.compact(that.parents('tr').find('.dop').text().split('; '));
        dopServicesReadyModal(dopServices);

    }).on('hidden.bs.modal', function (e) {
        $('.redy-dop-service').empty();
        dopServices = [];
    });


    $(document).on('click', '#saveDop', function(){
        saveDop(that.parents('tr'), that.parents('tr').find('.number').text(), that.parents('tr').find('.car').text(),  that.parents('tr').find('.time').data('minutes'));
    });
}

//Редактирование услуг к любой машине
function allCar(){
    let that;
    let services = [];
    $(document).on('click', '.redact', function (e) {
        e.preventDefault();
        let modal = $('#modalRedactService');
        modal.modal('show');
        setRedactService($(this).parents('tr').data('typeauto'));
        serviceRedactReady();
        that = $(this);
    });
    $('#modalRedactService').on('shown.bs.modal', function (e) {
        services = _.compact(that.parents('tr').find('.service-main').text().split('; '));
        servicesReadyModal(services);

    }).on('hidden.bs.modal', function (e) {
        $('.redy-redact-service').empty();
        services = [];
    });

    $(document).on('click', '#saveRedact', function(){
        saveRedact(that, that.parents('tr').find('.number').text(), that.parents('tr').find('.car').text(),  that.parents('tr').find('.time').data('minutes'));
    });
}

//автозаполнение номера
function autoNumber() {
    $(document).on('input', '#number', function () {
        let that = $(this);
        that.autocomplete({
            source:function( request, response ) {
                socket.emit('autocomplete', request.term, function (data) {
                    let res =  data.map(function (item) {
                        return item.number;
                    });
                    document.cookie = "client={};";
                    response(res);
                });
            },
            select: function (event, ui) {
                socket.emit('autocomplete', ui.item.value, function (data) {
                    if(data.length){
                        $('#marka').val(data[0].marka);
                        document.cookie = "client="+JSON.stringify(data[0]);
                        if(data[0].vip){
                            Snackbar.show({
                                text: 'Баланс клиента составляет: ' + data[0].balance + ' руб.',
                                pos: 'top-center',
                                actionText: 'OK',
                                duration: null
                            });
                            $('#vip').trigger('click');
                            $('.vip').append('<div class="alert alert-warning" role="alert"> VIP - клиент</div>')
                        }
                        // else{
                        //     console.log('no', data[0]);
                        //     $('#vip').trigger('click');
                        //     $('.vip').empty();
                        // }
                    }
                });
            }
        });
    })
}

//безнал
function nonСash(){
    $(document).on('click', '.checkbox-non-cash', function (e) {
        var p = confirm('Подтвердите свои действия!');
        if(p){
            var id = $(this).parents('tr').data('id');
            var flag = $(this).prop('checked');
            socket.emit('getNonCash', id, flag ,function (res) {
                if(res.status === 500){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }else {
                    socket.emit('cachbox', function (res) {
                        if (res.status === 500) {
                            Snackbar.show({
                                text: res.msg,
                                pos: 'bottom-right',
                                actionText: null
                            });
                        } else {
                            Snackbar.show({
                                text: res.msg,
                                pos: 'bottom-right',
                                actionText: null
                            });
                        }
                    });
                }
            });
        }else{
            e.preventDefault();
        }
    })
}

function partnocash(){
    $(document).on('change', '.part-noCash', function(){
        let data = {};
        data.price = +$(this).val();
        data.id = $(this).parents('tr').data('id');
        socket.emit('savePartNoCash', data ,function (res) {
            if(res.status === 200) {
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
            }else{
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
            }
        });
    });
}

//Частичная оплата
function deferCash(){
    $(document).on('click', '.defer-cash', function(e){
        let p = confirm('Подтвердите свои действия!');
        if(p){
            let data = {};
            data.id = $(this).parents('tr').data('id');
            data.val = $(this).is(":checked");
            data.price = +$(this).parents('tr').find('.price').text();
            socket.emit('deferCash', data ,function (res) {
                if(res.status === 200) {
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }else{
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            });
        }else{
            e.preventDefault();
        }
    });
}

//Скидка
function discount() {
    $(document).on('click', '.checkbox-discount', function (e) {
        var p = confirm('Подтвердите свое действие');
        if(p){
            let data = {};
            data.price = +$(this).parents('tr').data('discount');
            data.proc = $(this).parents('tr').data('proc');
            if(data.proc === undefined || data.proc === false){
                data.proc = false;
            }else{
                data.proc = true;
            }
            if($(this).prop("checked")){
                if(data.proc){
                    let main = +$(this).parents('tr').find('td.service-main').data('price');
                    let dop = +$(this).parents('tr').find('td.dop').data('price');
                    let price = main+dop;
                    $(this).parents('tr').find('td.price').text( Math.round(((100 - data.price) * price)/ 100) );
                    $(this).parents('tr').data('discountEn', Math.round((price - ((100 - data.price) * price)/ 100)) );
                }else{
                    let main = +$(this).parents('tr').find('td.service-main').data('price');
                    let dop = +$(this).parents('tr').find('td.dop').data('price');
                    let price = main+dop;
                    $(this).parents('tr').find('td.price').text( price - data.price  );
                    $(this).parents('tr').data('discountEn', data.price);
                }
                let src = {
                    id: $(this).parents('tr').data('id'),
                    discount: $(this).parents('tr').data('discountEn')
                };
                socket.emit('saveDiscount', src, function (res) {
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                })
            }else{
                let main = +$(this).parents('tr').find('td.service-main').data('price');
                let dop = +$(this).parents('tr').find('td.dop').data('price');
                let price = main+dop;
                $(this).parents('tr').find('td.price').text( price );
                $(this).parents('tr').data('discountEn', 0);
                let src = {
                    id: $(this).parents('tr').data('id'),
                    discount: $(this).parents('tr').data('discountEn')
                };
                socket.emit('saveDiscount', src, function (res) {
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                })
            }
        }else{
            e.preventDefault();
        }
    })
}