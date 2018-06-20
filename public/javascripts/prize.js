'use strict';
$(function() {
    personPrize();
    delPrize();
    datePrize();
});

//Нажатие на кнопку штраф
function personPrize() {
    $(document).on('click', '#prepaidDoPrize', function () {
        let data = {};
        data.person = $('#personsPrize').val();
        data.prize = +$('#prize').val();
        socket.emit('personPrize', data, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $('.prize').append(
                    '<tr class="tr-prize">' +
                    '<td>' +
                    moment().format('DD.MM.YYYY')+
                    '</td>' +
                    '<td>' +
                    data.person+
                    '</td>' +
                    '<td>' +
                    data.prize+
                    '</td>' +
                    '<td>' +
                    '<button type="button" id="delPrize" data-id='+res.id.insertedIds[0]+' class="btn btn-outline-dark">Удалить</button>'+
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

//удаление премии
function delPrize() {
    $(document).on('click', '#delPrize', function () {
        let that=  $(this);
        socket.emit('delPrize', $(this).data('id'), function (res) {
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


//Выборка по дате Премии
function datePrize() {
    $(document).on('click', '#lookPrizeDate', function () {
        socket.emit('getPrizeDate', $('#startDatePrize').val(), $('#endDatePrize').val(), function (res) {
            if(res.status === 200){
                $('.prize').empty();
                res.arr.forEach(function(item){
                    $('.prize').append(
                        '<tr class="tr-prize">' +
                        '<td>' +
                        item.date +
                        '</td>' +
                        '<td>' +
                        item.person +
                        '</td>' +
                        '<td>' +
                        item.prize +
                        '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-outline-dark" id="delPrize" data-id="'+item._id+'">Удалить</button>'+
                        '</td>' +
                        '</tr>'
                    );
                });
            }
        })
    })
}