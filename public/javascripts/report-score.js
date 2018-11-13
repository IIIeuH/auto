$(function(){
    $(document).on('click', '#lookScore', function(){
        var startScore = $('#startScore').val();
        var endScore = $('#endScore').val();
        var adminScore = $('#adminScore :selected').val();

        if(startScore === ''){
            Snackbar.show({
                text: 'Выбирите начало периода',
                pos: 'bottom-right',
                actionText: null
            });
        }else if(endScore === ''){
            Snackbar.show({
                text: 'Выбирите конец периода',
                pos: 'bottom-right',
                actionText: null
            });
        }else if(adminScore === ''){
            Snackbar.show({
                text: 'Выбирите администратора',
                pos: 'bottom-right',
                actionText: null
            });
        }else{
            socket.emit('getReportScore', startScore, endScore, adminScore, function (res) {
                var table = $('.report-score');
                if(res.status === 200){
                    table.empty();
                    if(res.result.length){
                        var sum = 0;
                        res.result.forEach( function(item) {
                            sum += (item.price * item.count);
                        });
                        var resGroupByName = _.chain(res.result).groupBy("name").map(function(v, i) {
                            return {
                                date: _.get(_.find(v, 'date'), 'date'),
                                name: _.get(_.find(v, 'name'), 'name'),
                                count: _.map(v, 'count').reduce( function(accum, item) { return (accum + item)}, 0),
                                price: _.get(_.find(v, 'price'), 'price'),
                            }
                        }).value();
                        resGroupByName.forEach( function(item) {
                            table.append(
                                '<tr>' +
                                '<td>'+item.date+'</td>' +
                                '<td>'+item.name+'</td>' +
                                '<td>'+item.count+'</td>' +
                                '<td>'+item.price * item.count+'</td>' +
                                '</tr>'
                            );
                        });
                        table.append(
                            '<tr><td colspan="3" style="text-align:right">ИТОГО:</td><td>'+sum+'</td></tr>'
                        )
                    }else{
                        return false;
                    }
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

});