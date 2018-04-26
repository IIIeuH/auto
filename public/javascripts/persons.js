'use strict';
var socket = io.connect('http://localhost:3000');
$(function() {
    delPersons();
    administrPersons();
    savePersons();
    refactorFio();
});

//////////////////////////////////////ПЕРСОНАЛ///////////////////////////
//Сохранение персонала
function savePersons(){
    var btn = $('#addPersons');
    btn.click(function(){
        let data = {};
        data.fio = $('#fio').val();
        data.administrator = false;
        socket.emit('savePersons', data, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                addPersonsInTable(data.fio, res.id);
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
function addPersonsInTable(fio, id){
    var el = $('.persons');
    el.append(
        '<tr>' +
            '<td contenteditable="true" data-id="'+id+'">' +
                fio +
            '</td>' +
            '<td>' +
                '<button type="button" class="btn btn-outline-info mr-5 administrPersons">Администратор</button>' +
                '<button type="button" class="btn btn-outline-dark delPersons" data-id="'+id+'">Удалить</button>' +
            '</td>' +
        '</tr>'
    )
}

//Изменение текста
function refactorFio() {
    $(document).on('blur', '.ref', function(){
        socket.emit('updatePersons', {_id: $(this).data('id'), fio: $(this).text()}, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        });
    });
}


//Удаление персонала
function delPersons() {
    $(document).on('click', '.delPersons', function () {
        let that = $(this);
        let c = confirm("Вы действительно хотите удалить " + $(this).parents('tr').find('.ref').text() + "?");
        if(c){
            socket.emit('delPersons', $(this).data('id'), function (res) {
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
        }
    })
}

//Администратор
function administrPersons() {
    $(document).on('click', '.administrPersons', function () {
        let that = $(this);
        if($(this).parents('tr').hasClass('table-info')){
            socket.emit('delAdministrPersons', $(this).data('id'), function (res) {
                if(res.status === 200){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                    that.parents('tr').toggleClass('table-info');
                }else{
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            })
        }else{
            socket.emit('administrPersons', $(this).data('id'), function (res) {
                if(res.status === 200){
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                    that.parents('tr').toggleClass('table-info');
                }else{
                    Snackbar.show({
                        text: res.msg,
                        pos: 'bottom-right',
                        actionText: null
                    });
                }
            })
        }
    })
}