$(function(){
   change();
});

function change(){
    $('.change-box').change(function(){

        var data = {
            _id: $(this).parents('tr').data("id"),
            box: $(this).val()
        };

        socket.emit('changeBox', data,  function (res) {
            if(res.status === 200) {
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