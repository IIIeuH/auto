'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    socket.on('connect', function() {
        console.log('Connected');
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
    dopService();
});


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
        if(car.val() === '' || number.val() === '' || washer.val() === ''){
            btn.attr('disabled', 'disabled');
        }else{
            btn.removeAttr('disabled');
        }
    });
    $(document).on('click', '#modalService', function(){
        var readyService = $('.service-ready');
        if(readyService.length){
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
        socket.emit('saveServices', data);
        tbody.append('' +
            '<tr class="str" data-typeauto="'+data.typeAuto+'">' +
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
            '<td class="dop">' +
            '</td>' +
            '<td>' +
            data.washer +
            '</td>' +
            '<td class="price">' +
            data.price +
            '</td>' +
            '<td class="d-flex justify-content-center">\n' +
            '  <button type="button" class="btn btn-dark delete">Удалить</button>\n' +
            '  <button type="button" class="btn btn-primary status-wash">Заехать</button>\n' +
            '  <button type="button" class="btn btn-success status-ready">Готово</button>\n' +
            '  <button type="button" class="btn btn-warning">Отмена</button>\n' +
            '  <button type="button" class="btn btn-info modalTwo">Доп. Услуги</button>\n' +
            '</td>' +
            '</i>' +
            '</td>' +
            '</tr>'
        );
        $('#modalService').modal('hide');
    });
}

//Сохранение доп услуг
function saveDop(tr, number, car, minutes){
    $(document).on('click', '#saveDop', function(){
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
        query.time = minutes;
        let dop = tr.find('.dop');
        let oldTime = tr.find('.time');
        let oldPrice = tr.find('.price');
        let p = $('.service-main').data('price') + +data.price;
        let k = $('.service-main').data('time') + +data.time;
        socket.emit('saveDopServices', data, query);
        oldTime.text(getTimeFromMins(k));
        oldPrice.text(p);
        dop.text(
            data.services
        );
        console.log(dop);
        dop.attr('data-price', data.price);
        dop.attr('data-time', data.time);
        $('#modalDopService').modal('hide');
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
            socket.emit('delString', {car: marka, number: number, services: services});
            socket.on('statusDel', (data) => {
                if(data.status === 200){
                    that.parents('.str').remove();
                }else{
                    console.log(data.err);
                }
            })
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
        var box = window.location.search.substr(8);
        var that = $(this);
        var p = confirm('Загнать машину ' + marka + ' с номером ' + number +' в бокс ' + box + '?');
        if(p){
            socket.emit('setStatus', {car: marka, number: number, services: services, box: box}, 'wash');
            socket.on('getStatus', function(){
                that.parents('.str').data("status", "wash");
                statusColor();
                statusBox();
            });
        }
    });
}

function statusBtnReady(){
    $(document).on('click' , '.status-ready', function(){
        var marka = $(this).parents('.str').find('.car').text();
        var number = $(this).parents('.str').find('.number').text();
        var services = $(this).parents('.str').find('.service-main').text();
        var box = window.location.search.substr(8);
        var that = $(this);
        var p = confirm('Машина ' + marka + ' с номером ' + number +' готова?');
        if(p){
            socket.emit('setStatus', {car: marka, number: number, services: services, box: box}, 'ready');
            socket.on('getStatus', function(){
                that.parents('.str').data('status', 'ready');
                statusColor();
                statusBox();
            });
        }
    });
}

function statusBtnAwait(){
    $(document).on('click' , '.status-await', function(){
        var marka = $(this).parents('.str').find('.car').text();
        var number = $(this).parents('.str').find('.number').text();
        var services = $(this).parents('.str').find('.service-main').text();
        var box = window.location.search.substr(8);
        var that = $(this);
        var p = confirm('Отменить машину ' + marka + ' с номером ' + number +'?');
        if(p){
            socket.emit('setStatus', {car: marka, number: number, services: services, box: box}, 'await');
            socket.on('getStatus', function(){
                that.parents('.str').data('status', 'await');
                statusColor();
                statusBox();
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
            console.log(time);
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

//Если доп услуги уже то они отображаются в модальном окне
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
//Доп услуги к любой машине
function dopAllCar(){
    let that;
    let dopServices = [];
    $(document).on('click', '.modalTwo', function () {
        let modal = $('#modalDopService');
        modal.modal('show');
        setDopService($(this).parents('tr').data('typeauto'));
        serviceDopReady();
        checkDopService();
        saveDop($(this).parents('tr'), $(this).parents('tr').find('.number').text(), $(this).parents('tr').find('.car').text(),  $(this).parents('tr').find('.time').data('minutes'));
        that = $(this);
    });
    $('#modalDopService').on('shown.bs.modal', function (e) {
        dopServices = _.compact(that.parents('tr').find('.dop').text().split('; '));
        dopServicesReadyModal(dopServices);

    }).on('hidden.bs.modal', function (e) {
        $('.redy-dop-service').empty();
        dopServices = [];
        console.log(dopServices);
    });
}