'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    socket.on('connect', function() {
        console.log('Connected');
    });
    savePersons();
    refactorFio();
});

function savePersons(){
    var btn = $('#addPersons');
    btn.click(function(){
        var fio = $('#fio').val();
        socket.emit('savePersons', {fio: fio});
        addPersonsInTable(fio);
    });
}

function addPersonsInTable(fio){
    var el = $('.persons');
    el.append(
        '<tr><td>'+fio+'</td></tr>'
    )
}

//Изменение текста
function refactorFio() {
    $(document).on('blur', '.ref', function(){
        socket.emit('updatePersons', {_id: $(this).data('id'), fio: $(this).text()});
    });
}