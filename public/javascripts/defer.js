'use strict';
$(function() {
    deferPrepaid();
});

//Подтверждение оплаты
function deferPrepaid(){
    $(document).on('click', '.status-defer', function(e){
        let p = confirm('Подтвердите свои действия!');
        let that = $(this);
        if(p){
            let data = {};
            data.id = $(this).attr('id');
            data.date = $(this).parents('tr').find('.date').text();
            data.price = +$(this).parents('tr').find('.price').text();
            socket.emit('statusDefer', data, function (res) {
                if(res.status === 200){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                    that.parents('tr').hide('fast');
                }else {
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            });
        }else{
            e.preventDefault();
        }
    });
}
