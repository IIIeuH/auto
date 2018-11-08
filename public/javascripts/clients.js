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
            balance : +$('#clients-balance').val(),
            discount : +$('#clients-discount').val(),
            proc : $('#clients-proc').prop('checked'),
            vip : $('#clients-vip').prop('checked')
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
        '<tr>' +
        '<td class="refClients number">'+data.number+'</td>'+
        '<td class="refClients marka">'+data.marka+'</td>'+
        '<td class="refClients fio">'+data.fio+'</td>'+
        '<td class="refClients birthday">'+data.birthday+'</td>'+
        '<td class="refClients phone">'+data.phone+'</td>' +
        '<td class="refClients balance">'+data.balance+'</td>' +
        '<td class="refClients discount">'+data.discount+'</td>' +
        '<td class="refClients proc">'+data.proc+'</td>' +
        '<td class="refClients vip">'+data.vip+'</td>' +
        '</tr>'
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
            balance : +$(this).parents('tr').find('.balance').text(),
            vip : ($(this).parents('tr').find('.vip').text() === 'Да' || $(this).parents('tr').find('.vip').text() === 'да') ? true : false
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

