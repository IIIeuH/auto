$(function(){
    $(document).on('click', '#lookSalary', function(){
        let data = {
            start: $('#startDateSaleryWasher').val(),
            end: $('#endDateSaleryWasher').val()
        };
        socket.emit('getSalaryWasher', data, function (res) {
            if(res.status === 200){
                var table = $('.salary-washer');
                table.empty();
                res.wash.forEach( function(item) {
                    table.append(
                        '<tr>' +
                        '<td>'+item.washer+'</td>' +
                        '<td>'+item.price+'</td>' +
                        '<td>'+item.fine+'</td>' +
                        '<td>'+item.score+'</td>' +
                        '<td>'+item.prepaid+'</td>' +
                        '<td>'+item.sum+'</td>' +
                        '</tr>'
                    );
                });
            }else{
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
            }
        });
    });


    $(document).on('click', '#lookSalaryAdmin', function(){
        let data = {
            start: $('#startDateSaleryAdministrator').val(),
            end: $('#endDateSaleryAdministrator').val()
        };
        socket.emit('getSalaryAdministrator', data, function (res) {
            if(res.status === 200){
                var table = $('.salary-administrator');
                table.empty();
                res.admin.forEach( function(item) {
                    table.append(
                        '<tr>' +
                        '<td>'+item.admin+'</td>' +
                        '<td>'+item.price+'</td>' +
                        '<td>'+item.fine+'</td>' +
                        '<td>'+item.score+'</td>' +
                        '<td>'+item.prepaid+'</td>' +
                        '<td>'+item.sum+'</td>' +
                        '</tr>'
                    );
                });
            }else{
                Snackbar.show({
                    text: res.msg,
                    pos: 'bottom-right',
                    actionText: null
                });
            }
        });
    });

});