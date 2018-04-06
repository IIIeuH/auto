'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    socket.on('connect', function() {
        console.log('Connected');
    });
    savePersons();
    refactorFio();
    saveMarks();
    refactorMarks();
    saveClients();
    refactorClietns();
});

//////////////////////////////////////ПЕРСОНАЛ///////////////////////////
//Сохранение персонала
function savePersons(){
    var btn = $('#addPersons');
    btn.click(function(){
        var fio = $('#fio').val();
        socket.emit('savePersons', {fio: fio}, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                addPersonsInTable(fio);
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
function addPersonsInTable(fio){
    var el = $('.persons');
    el.append(
        '<tr><td>'+fio+'</td></tr>'
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
////////////////////////////////////База клиентов///////////////////////////////////////
//Сохранение клиента
function saveClients(){
    $(document).on('click', '#addClients', function () {
        let data = {
            number : $('#clients-number-car').val(),
            marka :$('#clients-marka').val(),
            fio : $('#clients-fio').val(),
            phone : $('#clients-phone').val()
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
        '<td>'+data.phone+'</td></tr>'
    )
}

//Изменение текста
function refactorClietns() {
    $(document).on('blur', '.refClients', function(){
        let data = {
            number :$(this).parents('tr').find('.number').text(),
            marka :$(this).parents('tr').find('.marka').text(),
            fio : $(this).parents('tr').find('.fio').text(),
            phone : $(this).parents('tr').find('.phone').text()
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