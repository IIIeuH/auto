'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    dateCashbox();
});



//Выборка по дате Касса
function dateCashbox() {
    $(document).on('click', '#lookCashboxDate', function () {
        socket.emit('getCashboxDate', $('#startDateCashbox').val(), $('#endDateCashbox').val(), function (res) {
            if(res.status === 200){
                $('.cashbox').empty();
                res.arr.forEach(function(item){
                    if(!item.cashScore) item.cashScore = 0;
                    if(!item.cashStore) item.cashStore = 0;
                    if(!item.cashCar) item.cashCar = 0;
                    if(!item.cashCosts) item.cashCosts = 0;
                    if(!item.cashDops) item.cashDops = 0;
                    if(!item.cashTea) item.cashTea = 0;
                    if(!item.cashCoffee) item.cashCoffee = 0;
                    if(!item.cashCoffeeMachine) item.cashCoffeeMachine = 0;
                    if(!item.cashPrepaid) item.cashPrepaid = 0;
                    if(!item.encashment) item.encashment = 0;
                    if(!item.cashFine) item.cashFine = 0;
                    $('.cashbox').append(
                        '<tr class="tr-cashbox">' +
                        '<td>' +
                        item.date +
                        '</td>' +
                        '<td>' +
                        item.cashScore +
                        '</td>' +
                        '<td>' +
                        item.cashStore +
                        '</td>' +
                        '<td>' +
                        item.cashCar +
                        '</td>' +
                        '<td>' +
                        item.cashCosts +
                        '</td>' +
                        '<td>' +
                        item.cashDops +
                        '</td>' +
                        '<td>' +
                        item.cashTea +
                        '</td>' +
                        '<td>' +
                        item.cashCoffee +
                        '</td>' +
                        '<td>' +
                        item.cashCoffeeMachine +
                        '</td>' +
                        '<td>' +
                        item.cashPrepaid +
                        '</td>' +
                        '<td>' +
                        item.encashment +
                        '</td>' +
                        '<td>' +
                        item.cashFine +
                        '</td>' +
                        '</tr>'
                    );
                });
            }
        })
    })
}