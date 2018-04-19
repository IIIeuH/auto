'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    saveMarks();
    refactorMarks();
    validBtnMarks();
});



//////////////////////////////////////МАРКИ///////////////////////////
//Сохранение марки
function saveMarks(){
    var btn = $('#addMarks');
    btn.click(function(){
        var marka = $('#marks').val();
        socket.emit('saveMarks', {marka: marka}, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                addMarksInTable(marka);
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

//После нажатие на кнопку сохранить добавить в табоицу
function addMarksInTable(marka){
    var el = $('.marks');
    el.append(
        '<tr><td>'+marka+'</td></tr>'
    )
}

//Изменение текста
function refactorMarks() {
    $(document).on('blur', '.refMarks', function(){
        socket.emit('updateMarks', {_id: $(this).data('id'), marka: $(this).text()}, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        });
    });
}


//Неактивные кнопки Добавить марку
function validBtnMarks(){
    let btn = $('#addMarks');
    btn.prop('disabled', true);
    $(document).on('input', '#marks', function () {
        if($(this).val() !== ''){
            btn.prop('disabled', false);
        }else{
            btn.prop('disabled', true);
        }
    })
}
