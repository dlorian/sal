exports.toTimeNumber = function(timeString) {
    if(!timeString || timeString.length === 0) {
        return null;
    }

    var time = timeString.split(':');
    time.forEach(function(item, index) {
        time[index] = parseInt(item);
    });

    var timeNumber = null;
    if(time.length > 2) {
        timeNumber = (time[0] * 3600) + (time[1] * 60) + time[2];
    }
    else {
        timeNumber = (time[0] * 60) + time[1];
    }

    return timeNumber;
};

exports.fromTimeNumber = function(timeNumber) {
    var time = [];
    // Hours
    time[0] = '' + Math.floor(timeNumber / 3600);

    var leaves = timeNumber - time[0] * 3600;
    // Minutes
    time[1] = '' + Math.floor(leaves / 60);

    // Seconds
    time[2] = '' + (leaves - 60 * time[1]);

    for(var i = 0; i < time.length; i++) {
        if(time[i].length === 1) {
            time[i] = '0' + time[i];
        }
    }
    return time.join(':');
};