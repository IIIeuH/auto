'use strict';
var socket = io.connect('http://localhost:3000');
$(function(){
    socket.on('connect', function() {
        console.log('Connected');
    });

    //Расходы магазин клик по продукту
    $(document).on('click', '.product', function(){
            var warehouse = $(this).data('warehouse');
            var name = $(this).text();
            var price = $(this).data('price');
            var body = $('.product-body');
            var tdName = $('.product-name');
            var flag = true;
            tdName.each(function(){
                if($(this).text() === name) {
                    flag = false;
                    console.log($(this));
                    var number = $(this).parents('tr').find('.quantity').text();
                    if ((number) == $(this).parents('tr').find('.warehouse-table').text()) {
                        return false;
                    } else {
                        $(this).parents('tr').find('.quantity').text(+number + 1);
                    }
                }
            });
            if(flag){
                body.append(
                    '<tr class="quantity-minus">' +
                    '<td class="warehouse-table">' +
                    warehouse +
                    '</td>' +
                    '<td class="product-name">' +
                    name +
                    '</td>' +
                    '<td class="product-price">' +
                    price +
                    '</td>' +
                    '<td class="quantity qm">' +
                    1 +
                    '</td>' +
                    '<td class="remainder">' +
                    '</td>' +
                    '</tr>'
                );
            }
            $('.remainder').each(function () {
                var w = $(this).parents('tr').find('.warehouse-table').text();
                $(this).text(w - $(this).parents('tr').find('.quantity').text());
            })
    });

    //Расходы доп услуги клик по продукту
    $(document).on('click', '.product-dop', function(){
        var name = $(this).text();
        var price = $(this).data('price');
        var body = $('.product-dop-body');
        var tdName = $('.product-dop-name');
        var flag = true;
        tdName.each(function(){
            if($(this).text() === name) {
                flag = false;
                console.log($(this));
                var number = $(this).parents('tr').find('.quantity-dop').text();
                $(this).parents('tr').find('.quantity-dop').text(+number + 1);
            }
        });
        if(flag){
            body.append(
                '<tr class="quantity-minus">' +
                '<td class="product-dop-name">' +
                name +
                '</td>' +
                '<td class="product-dop-price">' +
                price +
                '</td>' +
                '<td class="quantity-dop qm">' +
                1 +
                '</td>' +
                '</tr>'
            );
        }
    });


    //Расходы основные клик по продукту
    $(document).on('click', '.product-main', function(){
        var name = $(this).text();
        var price = $(this).data('price');
        var body = $('.product-main-body');
        var tdName = $('.product-main-name');
        var flag = true;
        tdName.each(function(){
            if($(this).text() === name) {
                flag = false;
                console.log($(this));
                var number = $(this).parents('tr').find('.quantity-main').text();
                $(this).parents('tr').find('.quantity-main').text(+number + 1);
            }
        });
        if(flag){
            body.append(
                '<tr class="quantity-minus">' +
                '<td class="product-main-name">' +
                name +
                '</td>' +
                '<td class="product-main-price">' +
                price +
                '</td>' +
                '<td class="quantity-main qm">' +
                1 +
                '</td>' +
                '</tr>'
            );
        }
    });
    saveCosts();
    saveProductDop();
    saveProductMain();
    quantityMinus();
});

function saveCosts(){
    let btn = $('#saveCosts');
    btn.click(function () {
        let mas = [];
        let tr = $('.product-body').find('tr');
        tr.each(function () {
            let obj = {};
            obj.warehouse = $(this).find('.warehouse-table').text();
            obj.name = $(this).find('.product-name').text();
            obj.price = $(this).find('.product-price').text();
            obj.quantity = $(this).find('.quantity').text();
            obj.remainder = $(this).find('.remainder').text();
            mas.push(obj);
        });
        socket.emit('setCosts', mas);
    })
}


function saveProductDop(){
    let btn = $('#saveProductDop');
    btn.click(function () {
        let mas = [];
        let tr = $('.product-dop-body').find('tr');
        tr.each(function () {
            let obj = {};
            obj.name = $(this).find('.product-dop-name').text();
            obj.price = $(this).find('.product-dop-price').text();
            obj.quantity = $(this).find('.quantity-dop').text();
            mas.push(obj);
        });
        socket.emit('saveProductDop', mas);
    })
}

function saveProductMain(){
    let btn = $('#saveProductMain');
    btn.click(function () {
        let mas = [];
        let tr = $('.product-main-body').find('tr');
        tr.each(function () {
            let obj = {};
            obj.name = $(this).find('.product-main-name').text();
            obj.price = $(this).find('.product-main-price').text();
            obj.quantity = $(this).find('.quantity-main').text();
            mas.push(obj);
        });
        socket.emit('saveProductMain', mas);
    })
}

//Уменьшение количества товара
function quantityMinus() {
    $(document).on('click', '.quantity-minus', function () {
        if(( +$(this).find('.qm').text() - 1) == 0){
            $(this).remove();
        }else{
            $(this).find('.qm').text( +$(this).find('.qm').text() - 1);
            $(this).find('.remainder').text( +$(this).find('.remainder').text() + 1) ;
        }
    })
}
