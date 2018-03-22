'use strict';
var socket = io();
$(function(){
    btnActive();
    service();
    dopService();
    serviceReady();
    serviceDopReady();
    checkService();
    checkDopService();
    setService();
    setDopService();
    save();
    saveDop();
    del();
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
function setDopService(){
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
        $('.info-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + time);
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
        $('.info-dop-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + time);
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
        $('.info-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + time.toFixed(2));
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
        $('.info-dop-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price + ', Время: ' + time.toFixed(2));
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
    var btn = $('#save');
    btn.click(function(){
        var data = {};
        var services = $('.service-ready');
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
        var tbody = $('.tr-body');
        data.box = window.location.search.substr(8);
        data.date = moment().format('DD.MM.YYYY');
        data.startDay = moment().startOf('day');
        data.endDay = moment().endOf('day');
        socket.emit('saveServices', data);
        socket.on('status', (res) => {
           if(res.status === 200){
               console.log('ok');
               tbody.append('' +
                   '<tr class="str">' +
                   '<td class="time">' +
                   data.time  +
                   '</td>' +
                   '<td class="car">' +
                   data.car +
                   '</td>' +
                   '<td class="number">' +
                   data.number +
                   '</td>' +
                   '<td class="service-main">' +
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
                   '<td class="d-flex justify-content-center">' +
                   '<i class="material-icons delete">delete' +
                   '</i>' +
                   '</td>' +
                   '</tr>'
               );
               $('#modalService').modal('hide');
           }else{
                console.log('error');
           }
        });
    });
}

//Сохранение доп услуг
function saveDop(){
    var btn = $('#saveDop');
    btn.click(function(){
        var data = {};
        var services = $('.service-dop-ready');
        data.services = '';
        data.price = 0;
        data.time = 0;
        services.each(function(){
            data.services += $(this).text() + '; ';
            data.price += $(this).data('price');
            data.time += $(this).data('time');
        });
        var dop = $('.dop').last();
        var oldTime = $('.time').last();
        var oldPrice = $('.price').last();
        var p = +oldPrice.text() + +data.price;
        var k = +oldTime.text() + +data.time;
        socket.emit('saveDopServices', data);
        oldTime.text(k);
        oldPrice.text(p);
        dop.text(
            data.services
        );
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