'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    $('.services-admin-wrap').hide();
    $('.services-dop-admin-wrap').hide();
    serviceHide('.hide-service', '.services-admin-wrap', 'look-service', 'hide-service');
    serviceHide('.hide-dop-service', '.services-dop-admin-wrap', 'look-dop-service', 'hide-dop-service');
    serviceShow('.look-service','.services-admin-wrap','look-service','hide-service');
    serviceShow('.look-dop-service','.services-dop-admin-wrap','look-dop-service','hide-dop-service');
    deleteServices('.removeServices', 'services', '.service-admin-wrap');
    deleteServices('.removeDopServices', 'dopservices', '.service-dop-admin-wrap');
    delServiceNameAdmin('.removeNameService', '.services-admin-wrap', '.service-admin-wrap', 'services');
    delServiceNameAdmin('.removeNameServiceDop', '.services-dop-admin-wrap', '.service-dop-admin-wrap', 'dopservices');
    addFiled('services-admin-wrap', 'removeNameService', 'saveFiled', '.addFiled');
    addFiled('services-dop-admin-wrap', 'removeNameServiceDop', 'saveFiledDop', '.addDopFiled');
    saveFiled('.saveFiled', '.services-admin-wrap', '.service-admin-wrap', 'services');
    saveFiled('.saveFiledDop', '.services-dop-admin-wrap', '.service-dop-admin-wrap', 'dopservices');
    redactType('.type', 'services');
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
    validBtnTypeAuto();
    validBtnFine();
    addTypeAuto('#addServices', '#services', 'services', 'service-admin-wrap', 'removeServices', 'look-service', 'addFiled', '.services-wrap');
    addTypeAuto('#addDopServices', '#typeDopAuto', 'dopservices', 'service-dop-admin-wrap', 'removeDopServices', 'look-dop-service', 'addDopFiled', '.services-dop-wrap');
});


////////////////////////////////////Услуги///////////////////////////////////////
//При нажатии на кнопку показать раскриываются сервисы
//1 аргумент: класс кнопки, 2: родитель класс, 3: класс кнопки ПОКАЗАТЬ 4: класс кнопки СКРЫТЬ.
function serviceShow(btn, parent, btnShow, btnHide){
    $(document).on('click', btn, function () {
        let el = $(this).siblings(parent);
        el.show('fast');
        $(this).text("Скрыть");
        $(this).toggleClass(btnShow);
        $(this).toggleClass(btnHide);
    })
}
//1: класс кнопки СКРЫТЬ, 2: родитель, 3: класс кнопки ПОКАЗАТЬ 4: класс кнопки СКРЫТЬ.
function serviceHide(btn, parent, btnShow, btnHide){
    $(document).on('click', btn, function () {
        let el = $(this).siblings(parent);
        el.hide('fast');
        $(this).text("Показать");
        $(this).toggleClass(btnShow);
        $(this).toggleClass(btnHide);
    })
}

//Удаление
//1: класс кнопки, 2: коллекция в базе, 3: родитель
function deleteServices(btn, collection, parent) {
    $(document).on('click', btn, function () {
        let p = confirm('Вы действительно хотите удалить этот сервис?');
        if(p){
            let id = $(this).attr('id');
            let that = $(this);
            socket.emit('delete', collection, id, function (res) {
                if(res.status === 200){
                    that.parents(parent).remove();
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
//1: класс кнопки удалить, 2:родитель service, 3:родитель services, 4: collection
function delServiceNameAdmin(btn, parent1, parent2, collection) {
    $(document).on('click', btn, function () {
        let name = $(this).parents(parent1).find('.name').val();
        let type = $(this).parents(parent2).find('.type').val();
        let that = $(this);
        let p = confirm('Вы действительно хотите удалить услугу ' +name+'?');
        if(p){
            socket.emit('deleteNameService', collection, name, type, function (res) {
                if(res.status === 200){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                    that.parents(parent1).hide('fast', function(){ that.parents(parent1).remove(); });
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
//1: parent, 2: btn removeName, 3: btn saveField, 4:btn событие клика
function addFiled(parent, btnRemoveName, btnSaveField, btn) {
    let el = '<div class="'+parent+'">\n' +
        '  <button type="button" aria-label="Close" class="close '+btnRemoveName+'"><span aria-hidden="true">×</span></button>\n' +
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
        '<button type="button" class="btn btn-outline-info '+btnSaveField+'">Сохранить</button>' +
        '</div>';
    $(document).on('click', btn, function () {
        $(this).after(el);
    })
}


//Сохранение полей услуг
//1: btn click, 2: parent1, 3: parent2, 4: collection
function saveFiled(btn, parent1, parent2, collection){
    $(document).on('click', btn, function () {
        let el = $(this).parents(parent1);
        let type = $(this).parents(parent2).find('.type').val();
        let obj = {};
        let that = $(this);
        obj.name = el.find('.name').val();
        obj.price = +el.find('.price').val();
        obj.time = +el.find('.time').val();
        socket.emit('saveField', collection, type, obj, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                that.parents(parent1).hide('fast');
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
function redactType(field, collection) {
    $(document).on('blur', field, function () {
        socket.emit('updateType', collection, $(this).attr('id'), $(this).val(), function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        })
    })
}

//ДОбавление типа авто
//1: btn click, 2: input id, 3: collection, 4: parent1, 5: btn removeService, 6: btn show, 7: btn addField, 8: parent wrap
function addTypeAuto(btn, input, collection, parent, btnRemove, btnShow, btnAdd, parentWrap){
    $(document).on('click', btn, function () {
        let obj = {};
        obj.name = $(input).val();
        obj.service = [];
        console.log(obj);
        socket.emit('addTypeAuto', collection, obj, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                let el = '<div class="col-lg-4 col-md-12 col-sm-12">\n' +
                    '  <div class="'+parent+'">\n' +
                    '    <button type="button" aria-label="Close" class="close '+btnRemove+'"><span aria-hidden="true">×</span></button>\n' +
                    '    <div class="input-group mb-3">\n' +
                    '      <div class="input-group-prepend"><span class="input-group-text">Тип авто</span></div>\n' +
                    '      <input type="text" class="type form-control" value="'+$(input).val()+'"/>\n' +
                    '    </div>\n' +
                    '    <button type="button" class="btn btn-outline-dark '+btnShow+'">Показать</button>\n' +
                    '    <button type="button" style="margin-left: 10px;" class="btn btn-outline-primary '+btnAdd+'">Добавить</button>\n' +
                    '  </div>\n' +
                    '</div>';
                $(parentWrap).append(el);
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

//Неактивные кнопки Добавить тип авто
function validBtnTypeAuto(){
    let btn = $('#addServices');
    btn.prop('disabled', true);
    $(document).on('input', '#services', function () {
        if($(this).val() !== ''){
            btn.prop('disabled', false);
        }else{
            btn.prop('disabled', true);
        }
    })
}


//Неактивные кнопки штрафа
function validBtnFine(){
    let btn = $('#prepaidDoFine');
    btn.prop('disabled', true);
    $(document).on('change', '#personsFine, #fine', function () {
        if($(this).val() !== ''){
            btn.prop('disabled', false);
        }else{
            btn.prop('disabled', true);
        }
    })
}

