'use strict';
var socket = io.connect('http://localhost:3000');
$(function() {
    getCash();
    prepaidTo();
    delPrepaid();
    datePrep();
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
            console.log(res);
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
