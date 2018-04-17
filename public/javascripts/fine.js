'use strict';
var socket = io.connect('http://localhost:3000');
$(function() {
    personFine();
    delFine();
    dateFine();
});

//Нажатие на кнопку штраф
function personFine() {
    $(document).on('click', '#prepaidDoFine', function () {
        let data = {};
        data.person = $('#personsFine').val();
        data.fine = +$('#fine').val();
        socket.emit('personFine', data, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $('.fine').append(
                    '<tr class="tr-fine">' +
                        '<td>' +
                            moment().format('DD.MM.YYYY')+
                        '</td>' +
                        '<td>' +
                            data.person+
                        '</td>' +
                        '<td>' +
                            data.fine+
                        '</td>' +
                        '<td>' +
                            '<button type="button" id="delFine" data-id='+res.id.insertedIds[0]+' class="btn btn-outline-dark">Удалить</button>'+
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

//удаление штрафа
function delFine() {
    $(document).on('click', '#delFine', function () {
        let that=  $(this);
        socket.emit('delFine', $(this).data('id'), function (res) {
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


//Выборка по дате Штраф
function dateFine() {
    $(document).on('click', '#lookFineDate', function () {
        socket.emit('getFineDate', $('#startDateFine').val(), $('#endDateFine').val(), function (res) {
            if(res.status === 200){
                $('.fine').empty();
                res.arr.forEach(function(item){
                    $('.fine').append(
                        '<tr class="tr-fine">' +
                        '<td>' +
                        item.date +
                        '</td>' +
                        '<td>' +
                        item.person +
                        '</td>' +
                        '<td>' +
                        item.fine +
                        '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-outline-dark" id="delFine" data-id="'+item._id+'">Удалить</button>'+
                        '</td>' +
                        '</tr>'
                    );
                });
            }
        })
    })
}