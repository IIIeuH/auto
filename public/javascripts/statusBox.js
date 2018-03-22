$(function(){
    color();
});

//Если бокс занят больше чем на 3 часа у него красный цвет, меньше желтый, зеленый свободный.
function color() {
    var status = $('.status');
    status.each(function(){
        var time = $(this).find('.time').text();
        var hour = moment(time, 'hh:mm:ss').hour();
        if(hour >= 2){
            $(this).find('img').attr('style', 'background-color: #dc3545');
        }else if(hour > 1 && hour < 2){
            $(this).find('img').attr('style', 'background-color: #ffc107');
        }else{
            $(this).find('img').attr('style', 'background-color: #28a745');
        }
    });
}