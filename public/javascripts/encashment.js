'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    saveEncashment();
});

function saveEncashment() {
    $(document).on('click', '#saveEncashment', function () {
        socket.emit('saveEncashmanet', $('#encashment').val(), function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $('.encash').each(function () {
                   if($(this).find('td:first').text() === moment().format('DD.MM.YYYY')){
                       $(this).remove();
                   }
                });
                $('.encashment').append(
                    '<tr class="encash">' +
                    '<td>' +
                    moment().format('DD.MM.YYYY') +
                    '</td>' +
                    '<td>' +
                    $('#encashment').val() +
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
        });
    })
}

