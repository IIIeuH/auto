'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    socket.on('connect', function() {
        console.log('Connected');
    });
    $('.services-admin-wrap').hide();
    savePersons();
    refactorFio();
    saveMarks();
    refactorMarks();
    saveClients();
    refactorClietns();
    serviceHide();
    serviceShow();
    deleteServices();
    delServiceNameAdmin();
    addFiled();
    saveFiled();
    redactType();

    //Редактирование услуг
    $(document).on('click', '.updateField', function () {
        let parent = $(this).parents('.services-admin-wrap');
        let type = $(this).parents('.service-admin-wrap').find('.type').val();
        let index = parent.attr('id');
        let obj = {};
        obj.name = parent.find('.name').val();
        obj.price = +parent.find('.price').val();
        obj.time = +parent.find('.time').val();
        console.log(obj);
        socket.emit('updateFiled', type, index, obj, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        })
    });

    addTypeAuto();
});

//////////////////////////////////////ПЕРСОНАЛ///////////////////////////
//Сохранение персонала
function savePersons(){
    var btn = $('#addPersons');
    btn.click(function(){
        var fio = $('#fio').val();
        socket.emit('savePersons', {fio: fio}, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                addPersonsInTable(fio);
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

//После нажатие на кнопку сохранить добавить в табоицу
function addPersonsInTable(fio){
    var el = $('.persons');
    el.append(
        '<tr><td>'+fio+'</td></tr>'
    )
}

//Изменение текста
function refactorFio() {
    $(document).on('blur', '.ref', function(){
        socket.emit('updatePersons', {_id: $(this).data('id'), fio: $(this).text()}, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        });
    });
}

//////////////////////////////////////МАРКИ///////////////////////////
//Сохранение марки
function saveMarks(){
    var btn = $('#addMarks');
    btn.click(function(){
        var marka = $('#marks').val();
        socket.emit('saveMarks', {marka: marka}, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                addMarksInTable(marka);
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

//После нажатие на кнопку сохранить добавить в табоицу
function addMarksInTable(marka){
    var el = $('.marks');
    el.append(
        '<tr><td>'+marka+'</td></tr>'
    )
}

//Изменение текста
function refactorMarks() {
    $(document).on('blur', '.refMarks', function(){
        socket.emit('updateMarks', {_id: $(this).data('id'), marka: $(this).text()}, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        });
    });
}
////////////////////////////////////База клиентов///////////////////////////////////////
//Сохранение клиента
function saveClients(){
    $(document).on('click', '#addClients', function () {
        let data = {
            number : $('#clients-number-car').val(),
            marka :$('#clients-marka').val(),
            fio : $('#clients-fio').val(),
            phone : $('#clients-phone').val()
        };
        socket.emit('saveClients', data, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                addClietnsInTable(data);
            }else{
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
            }
        });
    })
}


//После нажатие на кнопку сохранить добавить в табоицу
function addClietnsInTable(data){
    var el = $('.clietns');
    el.append(
        '<tr><td>'+data.number+'</td>'+
        '<td>'+data.marka+'</td>'+
        '<td>'+data.fio+'</td>'+
        '<td>'+data.phone+'</td></tr>'
    )
}

//Изменение текста
function refactorClietns() {
    $(document).on('blur', '.refClients', function(){
        let data = {
            number :$(this).parents('tr').find('.number').text(),
            marka :$(this).parents('tr').find('.marka').text(),
            fio : $(this).parents('tr').find('.fio').text(),
            phone : $(this).parents('tr').find('.phone').text()
        };
        socket.emit('updateClients', $(this).data('id'), data, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        });
    });
}

////////////////////////////////////Услуги///////////////////////////////////////
//При нажатии на кнопку показать раскриываются сервисы
function serviceShow(){
    $(document).on('click', '.look-service', function () {
        let el = $(this).siblings('.services-admin-wrap');
        el.show('fast');
        $(this).text("Скрыть");
        $(this).toggleClass('hide-service');
        $(this).toggleClass('look-service');
    })
}

function serviceHide(){
    $(document).on('click', '.hide-service', function () {
        let el = $(this).siblings('.services-admin-wrap');
        el.hide('fast');
        $(this).text("Показать");
        $(this).toggleClass('look-service');
        $(this).toggleClass('hide-service');
    })
}

//Удаление
function deleteServices() {
    $(document).on('click', '.removeServices', function () {
        let p = confirm('Вы действительно хотите удалить этот сервис?');
        if(p){
            let id = $(this).attr('id');
            let that = $(this);
            socket.emit('delete', 'services', id, function (res) {
                if(res.status === 200){
                    that.parents('.service-admin-wrap').remove();
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
        }
    })
}

//Удаление названий сервисов
function delServiceNameAdmin() {
    $(document).on('click', '.removeNameService', function () {
        let name = $(this).parents('.services-admin-wrap').find('.name').val();
        let type = $(this).parents('.service-admin-wrap').find('.type').val();
        let that = $(this);
        let p = confirm('Вы действительно хотите удалить услугу ' +name+'?');
        if(p){
            socket.emit('deleteNameService', name, type, function (res) {
                if(res.status === 200){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                    that.parents('.services-admin-wrap').hide('fast', function(){ that.parents('.services-admin-wrap').remove(); });
                }else{
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            });
        }
    })
}

//Добавление полей услуг
function addFiled() {
    let el = '<div class="services-admin-wrap">\n' +
        '  <button type="button" aria-label="Close" class="close removeNameService"><span aria-hidden="true">×</span></button>\n' +
        '  <div class="input-group mb-3">\n' +
        '    <div class="input-group-prepend"><span class="input-group-text">Название</span></div>\n' +
        '    <input type="text" class="name form-control"/>\n' +
        '  </div>\n' +
        '  <div class="input-group mb-3">\n' +
        '    <div class="input-group-prepend"><span class="input-group-text">Цена</span></div>\n' +
        '    <input type="number" class="price form-control"/>\n' +
        '  </div>\n' +
        '  <div class="input-group mb-3">\n' +
        '    <div class="input-group-prepend"><span class="input-group-text">Время</span></div>\n' +
        '    <input type="number" class="time form-control"/>\n' +
        '  </div>\n' +
        '<button type="button" class="btn btn-outline-info saveFiled">Сохранить</button>' +
        '</div>';
    $(document).on('click', '.addFiled', function () {
        $(this).after(el);
    })
}


//Сохранение полей услуг
function saveFiled(){
    $(document).on('click', '.saveFiled', function () {
        let el = $(this).parents('.services-admin-wrap');
        let type = $(this).parents('.service-admin-wrap').find('.type').val();
        let obj = {};
        let that = $(this);
        obj.name = el.find('.name').val();
        obj.price = +el.find('.price').val();
        obj.time = +el.find('.time').val();
        socket.emit('saveField', type, obj, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                that.parents('.services-admin-wrap').hide('fast');
            }else{
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
            }
        })
    })
}

//Редактирование
function redactType() {
    $(document).on('blur', '.type', function () {
        socket.emit('updateType', $(this).attr('id'), $(this).val(), function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        })
    })
}

//ДОбавление типа авто
function addTypeAuto(){
    $(document).on('click', '#addServices', function () {
        let obj = {};
        obj.name = $('#services').val();
        obj.service = [];
        console.log(obj);
        socket.emit('addTypeAuto', obj, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                let el = '<div class="col-lg-4 col-md-12 col-sm-12">\n' +
                    '  <div class="service-admin-wrap">\n' +
                    '    <button type="button" aria-label="Close" class="close removeServices"><span aria-hidden="true">×</span></button>\n' +
                    '    <div class="input-group mb-3">\n' +
                    '      <div class="input-group-prepend"><span class="input-group-text">Тип авто</span></div>\n' +
                    '      <input type="text" class="type form-control" value="'+$('#services').val()+'"/>\n' +
                    '    </div>\n' +
                    '    <button type="button" class="btn btn-outline-dark look-service">Показать</button>\n' +
                    '    <button type="button" style="margin-left: 10px;" class="btn btn-outline-primary addFiled">Добавить</button>\n' +
                    '  </div>\n' +
                    '</div>';
                $('.services-wrap').append(el);
            }else{
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
            }
        });

    })
}