'use strict';
$(function(){
    saveMarks();
    refactorMarks();
    validBtnMarks();
    delMarks();
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
                addMarksInTable(marka, res.id);
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
function addMarksInTable(marka, id){
    var el = $('.marks');
    el.append(
        '<tr>' +
        '<td class="refMarks" contenteditable="true" data-id="'+id+'">' +
        marka +
        '</td>' +
        '<td>' +
        '<button class="btn btn-outline-dark delMarks" data-id="'+id+'">Удалить</button>' +
        '</td>'+
        '</tr>'
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

//Удаление марок
function delMarks() {
    $(document).on('click', '.delMarks', function(){
        let that = $(this);
        let c = confirm("Вы действительно хотите удалить " + $(this).parents('tr').find('.refMarks').text() + "?");
        if(c){
            socket.emit('delMarks', $(this).data('id'), function (res) {
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
            });
        }
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
