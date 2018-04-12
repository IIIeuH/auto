'use strict';
var socket = io.connect('http://localhost:3000');
$(function() {
    socket.on('connect', function () {
        console.log('Connected');
    });
    saveAddCosts('#btnAddCosts', '#addCosts', '#addCostsPrice', 'saveAddCosts', '.addCosts', 'nameAdd', 'priceAdd', 'delAddCosts');
    saveAddCosts('#btnAddDops', '#addDops', '#addDopsPrice', 'saveAddDops', '.addDops', 'nameAddDops', 'priceAddDops', 'delAddDops');
    delAddCosts('#delAddCosts', 'delAddCosts');
    delAddCosts('#delAddDops', 'delAddDops');
    delAddCosts('#delAddScore', 'delAddScore');
    redactAddCosts('.redactaddCosts', '.nameAdd', '.priceAdd', 'redactAddCosts');
    redactAddCosts('.redactaddDops', '.nameAddDops', '.priceAddDops', 'redactAddDops');
    saveScore();
    redAddScore();
});

//Сохранение add Costs

function saveAddCosts(btn, name, price, sockets, table, td1, td2, btnDel){
    $(document).on('click', btn, function () {
        let data = {};
        data.name = $(name).val();
        data.price = $(price).val();
        socket.emit(sockets, data, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $(table).append(
                    '<tr>' +
                        '<td class="redactaddCosts '+td1+'" contenteditable="true">' +
                            data.name +
                        '</td>' +
                        '<td class="redactaddCosts '+td2+'" contenteditable="true">' +
                            data.price +
                        '</td>' +
                        '<td>' +
                            '<button id="'+btnDel+'" type="button" data-id='+res.id.insertedIds[0]+' class="btn btn-outline-dark">Удалить</button>'+
                        '</td>' +
                    '</tr>'
                );
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

//del Add costs
function delAddCosts(btn, sockets){
    $(document).on('click', btn, function () {
        let that = $(this);
        socket.emit(sockets, $(this).data('id'), function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                that.parents('tr').hide('fast');
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

//redactor add Costs
function redactAddCosts(btn, name, price, sockets) {
    $(document).on('blur', btn, function () {
        let data = {};
        let query = $(this).parents('tr').find('button').data('id');
        data.name = $(this).parents('tr').find(name).text();
        data.price = +$(this).parents('tr').find(price).text();
        socket.emit(sockets, data, query, function (res) {
            if (res.status === 200) {
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

//Сохранение score
function saveScore() {
    $(document).on('click', '#btnAddScore', function () {
        let data = {};
        data.name = $('#addScoreName').val();
        data.price = $('#addScorePrice').val();
        data.warehouse = $('#addScoreWarehouse').val();
        socket.emit('saveDopScore', data, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $('.addScore').append(
                    '<tr>' +
                        '<td class="redactaddScore nameAddScore" contenteditable="true">' +
                            data.name +
                        '</td>' +
                        '<td class="redactaddScore priceAddScore" contenteditable="true">' +
                            data.price +
                        '</td>' +
                        '<td class="redactaddScore warehouseAddScore" contenteditable="true">' +
                            data.warehouse +
                        '</td>' +
                        '<td>' +
                            '<button id="delAddScore" type="button" data-id='+res.id.insertedIds[0]+' class="btn btn-outline-dark">Удалить</button>' +
                        '</td>' +
                    '</tr>'
                );
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

//Редактирование add Score
function redAddScore() {
    $(document).on('blur', '.redactaddScore', function () {
        let data = {};
        let query = $(this).parents('tr').find('button').data('id');
        data.name = $(this).parents('tr').find('.nameAddScore').text();
        data.price = +$(this).parents('tr').find('.priceAddScore').text();
        data.warehouse = +$(this).parents('tr').find('.warehouseAddScore').text();
        socket.emit('redactAddScore', data, query, function (res) {
            if (res.status === 200) {
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
    })
}
