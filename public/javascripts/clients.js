'use strict';
$(function(){
    saveClients();
    refactorClietns();
    validBtnClients();
});


////////////////////////////////////База клиентов///////////////////////////////////////
//Сохранение клиента
function saveClients(){
    $(document).on('click', '#addClients', function () {
        let data = {
            number : $('#clients-number-car').val(),
            marka :$('#clients-marka').val(),
            fio : $('#clients-fio').val(),
            phone : $('#clients-phone').val(),
            birthday : $('#clients-birthDay').val(),
            balance : +$('#clients-balance').val()
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
        '<td>'+data.birthday+'</td>'+
        '<td>'+data.phone+'</td></tr>' +
        '<td>'+data.balance+'</td></tr>'
    )
}

//Изменение текста
function refactorClietns() {
    $(document).on('blur', '.refClients', function(){
        let data = {
            number :$(this).parents('tr').find('.number').text(),
            marka :$(this).parents('tr').find('.marka').text(),
            fio : $(this).parents('tr').find('.fio').text(),
            birthday : $(this).parents('tr').find('.birthday').text(),
            phone : $(this).parents('tr').find('.phone').text(),
            balance : +$(this).parents('tr').find('.balance').text()
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



//Неактивные кнопки Добавить клиента
function validBtnClients(){
    let btn = $('#addClients');
    btn.prop('disabled', true);
    $(document).on('change', '#clients-number-car, #clients-marka, #clients-fio, #clients-birthDay, #clients-phone', function () {
        if($(this).val() !== ''){
            btn.prop('disabled', false);
        }else{
            btn.prop('disabled', true);
        }
    })
}

