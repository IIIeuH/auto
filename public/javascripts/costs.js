'use strict';
$(function(){
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
    saveTea();
    redactTea();
    saveCoffee();
    redactCoffee();
    btnDisabled();
    coffeeMachine();
    validCoffee();
    addArbitrary();
    saveArbitrary();
    delArbitrary();
});

function saveCosts(){
    let btn = $('#saveCosts');
    let btnNoCash = $('#saveCostsNoCash');
    let btnPerson = $('#saveCostsPerson');
    btnPerson.click(function () {
        let conf = confirm("Подтвердите действия!");
        if(conf){
            let mas = [];
            let tr = $('.product-body').find('tr');
            let name = $('#washer-score').val();
            let noCashe = false;
            let person = true;
            let admin = get_cookie('administrator');

            if(name === ''){
                Snackbar.show({
                    text: 'Выберете сотрудника!',
                    pos: 'bottom-right',
                    actionText: null
                });
                return false;
            }

            tr.each(function () {
                let obj = {};
                obj.warehouse = $(this).find('.warehouse-table').text();
                obj.name = $(this).find('.product-name').text();
                obj.price = +$(this).find('.product-price').text();
                obj.quantity = +$(this).find('.quantity').text();
                obj.remainder = +$(this).find('.remainder').text();
                mas.push(obj);
            });
            socket.emit('setCosts', mas,name,noCashe, person,admin,  function (res) {
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
        }else{
            return false;
        }
    });

    btnNoCash.click(function () {
        let conf = confirm("Подтвердите действия!");
        if(conf){
            let mas = [];
            let tr = $('.product-body').find('tr');
            //let name = $('#washer-score').val();
            let noCashe = true;
            let person = false;
            let admin = get_cookie('administrator');

            tr.each(function () {
                let obj = {};
                obj.warehouse = $(this).find('.warehouse-table').text();
                obj.name = $(this).find('.product-name').text();
                obj.price = +$(this).find('.product-price').text();
                obj.quantity = +$(this).find('.quantity').text();
                obj.remainder = +$(this).find('.remainder').text();
                mas.push(obj);
            });
            socket.emit('setCosts', mas, '', noCashe, person, admin,  function (res) {
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
        }else{
            return false;
        }
    });

    btn.click(function () {
        let conf = confirm("Подтвердите действия!");
        if(conf){
            let mas = [];
            let tr = $('.product-body').find('tr');
            let noCashe = false;
            let person = false;
            let admin = get_cookie('administrator');

            tr.each(function () {
                let obj = {};
                obj.warehouse = $(this).find('.warehouse-table').text();
                obj.name = $(this).find('.product-name').text();
                obj.price = +$(this).find('.product-price').text();
                obj.quantity = +$(this).find('.quantity').text();
                obj.remainder = +$(this).find('.remainder').text();
                mas.push(obj);
            });
            socket.emit('setCosts', mas, '', noCashe, person, admin, function (res) {
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
        }else{
            return false;
        }
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
            obj.price = +$(this).find('.product-dop-price').text();
            obj.quantity = +$(this).find('.quantity-dop').text();
            mas.push(obj);
        });
        socket.emit('saveProductDop', mas, function (res) {
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

function saveProductMain(){
    let btn = $('#saveProductMain');
    btn.click(function () {
        let mas = [];
        let tr = $('.product-main-body').find('tr');
        let name = get_cookie('washer');
        tr.each(function () {
            let obj = {};
            obj.name = $(this).find('.product-main-name').text();
            obj.price = +$(this).find('.product-main-price').text();
            obj.quantity = +$(this).find('.quantity-main').text();
            mas.push(obj);
        });
        socket.emit('saveProductMain', mas,name,function (res) {
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

function get_cookie ( cookie_name )
{
    var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

    if ( results )
        return ( results[2]);
    else
        return null;
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

//Сохранение чая
function saveTea(){
    $(document).on('click', '#saveTea', function () {
        let tea = {};
        let sugar = {};
        let stirrer = {};
        let glasses = {};

        tea.name = 'Чай';
        tea.price = +$('#tea-price').val();
        tea.quantity = +$('#tea-pieces').val();

        sugar.name = 'Сахар';
        sugar.price = +$('#sugar-price').val();
        sugar.quantity = +$('#sugar-pieces').val();

        stirrer.name = 'Размешиватели';
        stirrer.price = +$('#stirrer-price').val();
        stirrer.quantity = +$('#stirrer-pieces').val();

        glasses.name = 'Стаканы';
        glasses.price = +$('#glasses-price').val();
        glasses.quantity = +$('#glasses-pieces').val();

        let costs = [];
        costs.push(tea, sugar, stirrer, glasses);
        socket.emit('saveTea', costs, function (res) {
            if(res.status === 200) {
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $('.tea-table').append(
                    '<tr class="elev">' +
                    '<td>' +
                    tea.name +
                    '</td>' +
                    '<td contenteditable="true">' +
                    tea.price +
                    '</td>' +
                    '<td contenteditable="true">' +
                    tea.quantity +
                    '</td>' +
                    '</tr>' +
                    '<tr class="elev">' +
                    '<td>' +
                    sugar.name +
                    '</td>' +
                    '<td contenteditable="true">' +
                    sugar.price +
                    '</td>' +
                    '<td contenteditable="true">' +
                    sugar.quantity +
                    '</td>' +
                    '</tr>'+
                    '<tr class="elev">' +
                    '<td>' +
                    stirrer.name +
                    '</td>' +
                    '<td contenteditable="true"> ' +
                    stirrer.price +
                    '</td>' +
                    '<td contenteditable="true">' +
                    stirrer.quantity +
                    '</td>' +
                    '</tr>'+
                    '<tr class="elev">' +
                    '<td>' +
                    glasses.name +
                    '</td>' +
                    '<td contenteditable="true">' +
                    glasses.price +
                    '</td>' +
                    '<td contenteditable="true">' +
                    glasses.quantity +
                    '</td>' +
                    '</tr>'
                );
            }else{
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
            }
        });
        btnDisabled();
    })
}

//Редактирование tea
function redactTea(){
    $(document).on('blur', '.teaRed', function () {
        let id = $(this).prev('.id').text();
        let el = $('.elev');
        let costs = [];
        el.each(function () {
           let obj = {};
           obj.name = $(this).find('.id').text();
           obj.price = +$(this).find('.price').text();
           obj.quantity = +$(this).find('.quantity').text();
           costs.push(obj);
        });
        socket.emit('redactorTea', costs, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        });
    })
}

//Сохранение кофе
function saveCoffee(){
    $(document).on('click', '#saveCoffee', function () {
        let tea = {};
        let sugar = {};
        let stirrer = {};
        let glasses = {};
        let water = {};

        tea.name = 'Кофе';
        tea.price = +$('#coffee-price').val();
        tea.quantity = +$('#coffee-pieces').val();

        sugar.name = 'Сахар';
        sugar.price = +$('#sugar-price').val();
        sugar.quantity = +$('#sugar-pieces').val();

        stirrer.name = 'Размешиватели';
        stirrer.price = +$('#stirrer-price').val();
        stirrer.quantity = +$('#stirrer-pieces').val();

        glasses.name = 'Стаканы';
        glasses.price = +$('#glasses-price').val();
        glasses.quantity = +$('#glasses-pieces').val();

        water.name = 'Вода';
        water.price = +$('#water-price').val();
        water.quantity = +$('#water-pieces').val();

        let costs = [];
        costs.push(tea, sugar, stirrer, glasses, water);
        socket.emit('saveCoffee', costs, function (res) {
            if(res.status === 200){
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
                $('.coffee-body').append(
                    '<tr class="elev">' +
                    '<td>' +
                    tea.name +
                    '</td>' +
                    '<td contenteditable="true">' +
                    tea.price +
                    '</td>' +
                    '<td contenteditable="true">' +
                    tea.quantity +
                    '</td>' +
                    '</tr>' +
                    '<tr class="elev">' +
                    '<td>' +
                    sugar.name +
                    '</td>' +
                    '<td contenteditable="true">' +
                    sugar.price +
                    '</td>' +
                    '<td contenteditable="true">' +
                    sugar.quantity +
                    '</td>' +
                    '</tr>'+
                    '<tr class="elev">' +
                    '<td>' +
                    stirrer.name +
                    '</td>' +
                    '<td contenteditable="true">' +
                    stirrer.price +
                    '</td>' +
                    '<td contenteditable="true">' +
                    stirrer.quantity +
                    '</td>' +
                    '</tr>'+
                    '<tr class="elev">' +
                    '<td>' +
                    glasses.name +
                    '</td>' +
                    '<td contenteditable="true">' +
                    glasses.price +
                    '</td>' +
                    '<td contenteditable="true">' +
                    glasses.quantity +
                    '</td>' +
                    '</tr>'+
                    '<tr class="elev">' +
                    '<td>' +
                    water.name +
                    '</td>' +
                    '<td contenteditable="true">' +
                    water.price +
                    '</td>' +
                    '<td contenteditable="true">' +
                    water.quantity +
                    '</td>' +
                    '</tr>'
                );
            }else{
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
            }
        });
        btnDisabled();
    })
}


//Редактирование кофе
function redactCoffee(){
    $(document).on('blur', '.cofeeRed', function () {
        let el = $('.elev');
        let costs = [];
        el.each(function () {
            let obj = {};
            obj.name = $(this).find('.id').text();
            obj.price = +$(this).find('.price').text();
            obj.quantity = +$(this).find('.quantity').text();
            costs.push(obj);
        });
        socket.emit('redactorCoffee', costs, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        });
    })
}

//Блокирование кнопки если есть кофе или чай
function btnDisabled(){
    if($('tr').is('.elev')){
        $('#saveTea').prop('disabled', true);
        $('#saveCoffee').prop('disabled', true);
    }
}

//Сохранение Кофе машины
function coffeeMachine(){
    $(document).on('click', '#saveAutomat', function () {
        let start = +$('#coffee-start').val();
        let end = +$('#coffee-end').val();
        socket.emit('saveMachines', start, end, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        });
    })
}

//Если на начло дня у кофемашины уже есть цифра то ее нельзя изменить
function validCoffee(){
    let start = $('#coffee-start');
    if(start.val()){
        start.prop('disabled', true);
    }
}

//Произвольные расходы ДОавление в табоицу
function addArbitrary() {
    let btn = $('#saveArbitrary');
    btn.click(function () {
        let data = {};
        data.name = $('#arbitrary-name').val();
        data.price = $('#arbitrary-price').val();
        let table = $('.product-arbitrary-body');
        table.append(
            '<tr class="arbitrary-table">' +
            '<td class="arbitrary-name">' +
            data.name +
            '</td>' +
            '<td class="arbitrary-price">' +
            data.price +
            '</td>' +
            '</tr>'
        );
    })
}

//Произвольные расходы сохранение
function saveArbitrary() {
    $(document).on('click', '#saveProductArbitrary', (function () {
        let el = $('.arbitrary-table');
        let costs = [];
        let name = get_cookie('washer');
        el.each(function () {
            let obj = {};
            obj.name = $(this).find('.arbitrary-name').text();
            obj.price = +$(this).find('.arbitrary-price').text();
            costs.push(obj);
        });
        socket.emit('saveArbitrary', costs, name, function (res) {
            Snackbar.show({
                text: res.msg,
                pos: 'bottom-right',
                actionText: null
            });
        });
    }));
}

//Удаление произвольные расходы

function delArbitrary() {
    $(document).on('click', '.arbitrary-table', function (e) {
        let p = confirm('Подтвердите свои действия!');
        let that = $(this);
        if(p){
            that.hide('fast');
            that.remove();
        }else{
            e.preventDefault();
        }
    })
}