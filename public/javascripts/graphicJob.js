'use strict';
$(function() {
    dateJob();
    filterSearch('.searchAdmin', '.fieldSearchAdmin');
    filterSearch('.searchWasher', '.fieldSearchWasher');
});

//Выборка по дате График Работы
function dateJob() {
    $(document).on('click', '#lookJobDate', function () {
        socket.emit('getJobDate', $('#startDateJob').val(), $('#endDateJob').val(), function (res) {
            if(res.status === 200){
                $('.graphicJob').empty();
                res.arr.forEach(function(item){
                    if(item.dopServices === undefined){
                        item.dopServices = '';
                    }
                    $('.graphicJob').append(
                        '<tr>' +
                        '<td>' +
                        item.date +
                        '</td>' +
                        '<td class="fieldSearchAdmin">' +
                        item.administrator +
                        '</td>' +
                        '<td >' +
                        item.car +
                        '</td>' +
                        '<td >' +
                        item.number +
                        '</td>' +
                        '<td class="fieldSearchWasher">' +
                        item.washer +
                        '</td>' +
                        '<td >' +
                        item.services + ' ' + item.dopServices +
                        '</td>' +
                        '<td >' +
                        (item.mainPrice + item.dopPrice) +
                        '</td>' +
                        '</tr>'
                    );
                });
            }
        })
    })
}

//Фильтр таблицы
function filterSearch(item, field){
    $(document).on('change', item, function () {
        let that = $(this);
        if(that.val() === ''){
            $('.graphicJob').find('tr').show('fast');
        }
        $(field).each(function () {
            if(!~$(this).text().indexOf(that.val())){
                $(this).parents('tr').hide('fast');
            }else{
                $(this).parents('tr').show('fast');
            }
        })
    })
}
