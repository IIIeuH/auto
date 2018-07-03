$(function(){
    dateReport();
});


//Выборка по дате Отчет
function dateReport() {
    $(document).on('click', '#lookReportDate', function () {
        socket.emit('getReportDate', $('#startDateReport').val(), $('#endDateReport').val(), function (res) {
            if(res.status === 200){
                $('.reports').empty();
                res.arr.washers.forEach(function(item, i){
                    $('.reports').append(
                        '<tr>' +
                        '<td>' +
                        item.fio +
                        '</td>' +
                        '<td>' +
                        res.arr.cars[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.sumArr[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.costsArr[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.dopCostsArr[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.arbitrarsArr[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.scoresArr[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.discountArr[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.cardsArr[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.deferCashArr[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.vipArr[i] +
                        '</td>' +
                        '<td>' +
                        res.arr.prevDeferCashArr[i] +
                        '</td>' +
                        '</tr>'
                    );
                });
                $('.cashReport').empty().text(res.arr.cashbox);
                $('.avansReport').empty().text(res.arr.prepaid);
                $('.coffeReport').empty().text(res.arr.coffee);
                $('.teaReport').empty().text(res.arr.tea);
                $('.coffeTReport').empty().text(res.arr.coffeeT);
            }
        })
    })
}