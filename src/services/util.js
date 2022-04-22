function dateFormat(oldDate, newFormat){
    const {format, utcToZonedTime} = require("date-fns-tz");
    const timeZone = 'Europe/London';
    const timeInBritishsbane = utcToZonedTime(oldDate, timeZone);
    return format(timeInBritishsbane, newFormat);
}

export {dateFormat};