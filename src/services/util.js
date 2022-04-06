function dateFormat(oldDate, newFormat){
    const {format,utcToZonedTime,} = require("date-fns-tz");
    const timeZone = 'Europe/London';
    const timeInBrisbane = utcToZonedTime(oldDate, timeZone);
    return format(timeInBrisbane, newFormat);
}


export {dateFormat};