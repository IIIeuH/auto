'use strict';
$(function() {
    getCash();
    prepaidTo();
    delPrepaid();
    prepaidToDay();
    prepaidAdvance()
    datePrep();
    validBtnPrepaid();
});

function getCash() {
    $(document).on('change', '#personsPrepaid', function () {
        socket.emit('getCash', $(this).val(), function (res) {
            if(res.status === 200){
                $('.cashWasher ').empty();
                $('.cashWasher ').append("Заработок от начала месяца: <span id='prepaidPrice'>"+ res.cash+"</span>")
            }
        })
    })
}

function prepaidAdvance(){
    var btn = $('#prepaidAdvance');
    btn.click(function(){
        var cash =  $('#prepaidAdv').val();
        socket.emit('cashPrepaidDay', $('#personsPrepaid').val(), cash, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $('.prepaid').append(
                    '<tr class="tr-prep">' +
                    '<td class="date-prep">' +
                    moment().format('DD.MM.YYYY') +
                    '</td>' +
                    '<td>' +
                    $('#personsPrepaid').val() +
                    '</td>' +
                    '<td class="pricePrepTable">' +
                    cash+
                    '</td>' +
                    '<td>' +
                    '<button type="button" class="btn btn-outline-dark del-prepaid" id="'+res.id.insertedIds[0]+'">Удалить</button>'+
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
    });
}

function prepaidTo(){
    $(document).on('click', '#prepaidTo', function () {
        let price = +$('#prepaidPrice').text();
        socket.emit('cashPrepaid', $('#personsPrepaid').val(), function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $('.prepaid').append(
                    '<tr class="tr-prep">' +
                    '<td class="date-prep">' +
                        moment().format('DD.MM.YYYY') +
                    '</td>' +
                    '<td>' +
                        $('#personsPrepaid').val() +
                    '</td>' +
                    '<td class="pricePrepTable">' +
                    Math.round(price*30/100)+
                    '</td>' +
                    '<td>' +
                    '<button type="button" class="btn btn-outline-dark del-prepaid" id="'+res.id.insertedIds[0]+'">Удалить</button>'+
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

function prepaidToDay(){
    $(document).on('click', '#prepaidToDay', function () {
        let cash = 400;
        socket.emit('cashPrepaidDay', $('#personsPrepaid').val(), cash, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $('.prepaid').append(
                    '<tr class="tr-prep">' +
                    '<td class="date-prep">' +
                    moment().format('DD.MM.YYYY') +
                    '</td>' +
                    '<td>' +
                    $('#personsPrepaid').val() +
                    '</td>' +
                    '<td class="pricePrepTable">' +
                    400+
                    '</td>' +
                    '<td>' +
                    '<button type="button" class="btn btn-outline-dark del-prepaid" id="'+res.id.insertedIds[0]+'">Удалить</button>'+
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

function delPrepaid(){
    $(document).on('click', '.del-prepaid', function () {
        let query = {};
        query._id = $(this).attr('id');
        query.prepaid = +$(this).parents('.tr-prep').find('.pricePrepTable').text();
        query.date = $(this).parents('.tr-prep').find('.date-prep').text();
        let that = $(this);
        socket.emit('delPrepaid', query, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                that.parents('.tr-prep').hide('fast');
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

//Выборка по дате Аванс
function datePrep() {
    $(document).on('click', '#lookPredDate', function () {
        socket.emit('getPrepDate', $('#startDatePrep').val(), $('#endDatePrep').val(), function (res) {
            if(res.status === 200){
                $('.prepaid').empty();
                res.arr.forEach(function(item){
                    $('.prepaid').append(
                        '<tr class="tr-prep">' +
                        '<td class="date-prep">' +
                        item.date +
                        '</td>' +
                        '<td>' +
                        item.person +
                        '</td>' +
                        '<td class="pricePrepTable">' +
                        item.prepaid +
                        '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-outline-dark del-prepaid" id="'+item._id+'">Удалить</button>'+
                        '</td>' +
                        '</tr>'
                    );
                });
            }
        })
    })
}

//Неактивные кнопки выдать аванс и выдать ежедневный аванс
function validBtnPrepaid(){
    let btn1 = $('#prepaidTo');
    let btn2 = $('#prepaidToDay');
    let btn3 = $('#prepaidAdvance');
    btn1.prop('disabled', true);
    btn2.prop('disabled', true);
    btn3.prop('disabled', true);
    $(document).on('change', '#personsPrepaid', function () {
        if($(this).val() !== ''){
            btn1.prop('disabled', false);
            btn2.prop('disabled', false);
            btn3.prop('disabled', false);
        }else{
            btn1.prop('disabled', true);
            btn2.prop('disabled', true);
            btn3.prop('disabled', true);
        }
    })
}