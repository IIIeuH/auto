$(function(){
    timer();
    color();
});

//Если бокс занят больше чем на 3 часа у него красный цвет, меньше желтый, зеленый свободный.
function color() {
    var status = $('.status');
    status.each(function(){
        var time = $(this).find('.time').data('time');
        if(time >= 120){
            $(this).find('img').attr('style', 'background-color: #dc3545');
        }else if(time > 1 && time < 120){
            $(this).find('img').attr('style', 'background-color: #ffc107');
        }else{
            $(this).find('img').attr('style', 'background-color: #28a745');
        }
    });
}

//TIMER
function timer(){
    var status = $('.status');
    setInterval(function(){
        status.each(function(){
            var time = $(this).find('.time').data('time');
            if(time === 0){
                return false;
            }
            time = time -1;
            $(this).find('.time').data('time', time);
            var tim = getTimeFromMins(time);
            $(this).find('.time').empty();
            $(this).find('.time').text(tim);
        });
        color();
    }, 1000 * 60);

}

//перевод минут в часы и минуты
function getTimeFromMins(mins) {
    let hours = Math.trunc(mins/60);
    let minutes = mins % 60;
    if(minutes.toString().length === 1){
        minutes = '0' + minutes;
    }
    if(hours.toString().length === 1){
        hours = '0' + hours;
    }
    return hours + ':' + minutes;
}