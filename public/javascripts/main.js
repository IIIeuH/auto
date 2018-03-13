'use strict';
var socket = io();
$(function(){
    btnActive();
    service();
    serviceReady();
    checkService();
    setService();
    save();
});

function setService(){
    socket.on('setService', function(data){
        var el = $('.set-service');
        el.empty();
        data.forEach( (item) => {
            item['service'].forEach( (service) => {
                el.append('<div class="d-inline-flex p-2 service" data-price="'+service.price+'">'+service.name+'</div>')
            });
        })
    });
}

function service(){
    $(document).on('click', '.service', function() {
        var price = 0;
        $('.redy-service').append('<div class="d-inline-flex p-2 service-ready" data-price="'+$(this).data('price')+'">' + $(this).text() + '</div>');
        var serviceReady = $('.service-ready');
        serviceReady.each(function(){
            price += $(this).data('price');
        });
        $('.info-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price);
    });
}

function serviceReady(){
    $(document).on('click', '.service-ready', function(){
        $(this).remove();
        var price = 0;
        var serviceReady = $('.service-ready');
        serviceReady.each(function(){
            price += $(this).data('price');
        });
        $('.info-service').text('Выбрано '+(serviceReady.length) + ', Цена: ' + price);
    });
}

function checkService(){
    var el = $('.type-auto');
    el.click(function(){
        el.removeClass('activeType');
        $('.redy-service').empty();
        $('.info-service').text('Выбрано 0, Цена: 0');
        $(this).addClass('activeType');
        socket.emit('getService', {name: $(this).text()});
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

//Сохранение
function save(){
    var btn = $('#save');
    btn.click(function(){
        var services = $('.service-ready');
        var car = $('#marka').val();
        var number = $('#number').val();
        var washer = $('#washer').val();
        var str = '';
        var price = 0;
        services.each(function(){
            str += $(this).text() + ' ';
            price += $(this).data('price');
        });
        var tbody = $('.tr-body');
        tbody.append('' +
            '<tr>' +
            '<td>' +
            car +
            '</td>' +
            '<td>' +
            number +
            '</td>' +
            '<td>' +
            str +
            '</td>' +
            '<td>' +
            washer +
            '</td>' +
            '<td>' +
            price +
            '</td>' +
            '</tr>'
        );
        $('#modalService').modal('hide');
    });
}