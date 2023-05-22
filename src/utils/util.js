function withData(param) {
    return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end) {
    var start = start || 0;
    var end = end || 1;
    var array = [];
    for (var i = start; i <= end; i++) {
        array.push(withData(i));
    }
    return array;
}
function getMaxMonthDay(year, month) {
    var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
    var maxDay = null;
    if (/^[1-9]\d*$/.test(month)) {
        month = withData(month);
    }
    switch (month) {
        case '01':
        case '03':
        case '05':
        case '07':
        case '08':
        case '10':
        case '12':
            maxDay = 31;
            break;
        case '04':
        case '06':
        case '09':
        case '11':
            maxDay = 30;
            break;
        case '02':
            maxDay = flag ? 29 : 28;
            break;
        default:
            maxDay = 0;
    }
    return maxDay;
}
function getMonthDay(year, month, start, end) {
    var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
    var array = null;
    switch (month) {
        case '01':
        case '03':
        case '05':
        case '07':
        case '08':
        case '10':
        case '12':
            array = getLoopArray(start, end);
            break;
        case '04':
        case '06':
        case '09':
        case '11':
            array = getLoopArray(start, end);
            break;
        case '02':
            array = flag ? getLoopArray(start, end) : getLoopArray(start, end);
            break;
        default:
            array = '月份格式不正确，请重新输入！';
    }
    return array;
}
function getNewDateArry() {
    // 当前时间的处理
    var newDate = new Date();
    var year = withData(newDate.getFullYear());
    var mont = withData(newDate.getMonth() + 1);
    var date = withData(newDate.getDate());
    var hour = withData(newDate.getHours());
    var minu = withData(newDate.getMinutes());
    var seco = withData(newDate.getSeconds());
    return [year, mont, date, hour, minu, seco];
}
function dateTimePicker(startYear, endYear, startMonth, endMonth, startDay, endDay, defaultShowTime) {
    // 返回默认显示的数组和联动数组的声明
    var dateTime = [];
    var dateTimeArray = [[], [], [], [], [], []];
    var start = startYear || 1978;
    var end = endYear || 2100;
    var startMonth = startMonth || 1;
    var endMonth = endMonth || 12;
    // 默认开始显示数据
    if (defaultShowTime) {
        var defaultDate = [...defaultShowTime.split(' ')[0].split('-'), ...defaultShowTime.split(' ')[1].split(':')];
    } else {
        var defaultDate = getNewDateArry();
    } // 处理联动列表数据
    /*年月日 时分秒*/
    dateTimeArray[0] = getLoopArray(start, end);
    dateTimeArray[1] = getLoopArray(startMonth, endMonth);
    dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1], startDay, endDay);
    dateTimeArray[3] = getLoopArray(9, 17);
    dateTimeArray[4] = getLoopArray(0, 59);
    dateTimeArray[5] = getLoopArray(0, 59);
    dateTimeArray.forEach((current, index) => {
        dateTime.push(current.indexOf(defaultDate[index]));
    });
    return {
        dateTimeArray: dateTimeArray,
        dateTime: dateTime
    };
}
module.exports = {
    dateTimePicker: dateTimePicker,
    getMonthDay: getMonthDay,
    getMaxMonthDay: getMaxMonthDay
};
