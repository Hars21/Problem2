import moment from 'moment';



export default {
    timestampToDate,
    todayDate,
    getDates,
    todayDatetime,
    WeekLateDatetime,
    removeMiliSec,
    currentMonth,
    utcTodayDate,
    ISOtoLocal,
    utcTodayDatetime,
    getYear,
    getMonth,
    dateZeroFix,
    addMinutes,
    convertDatePickerTimeToMySQLTime

};
function convertDatePickerTimeToMySQLTime(str) {
    let month, day, year, hours, minutes, seconds;
    date = new Date(str),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    hours = ("0" + date.getHours()).slice(-2);
    minutes = ("0" + date.getMinutes()).slice(-2);
    seconds = ("0" + date.getSeconds()).slice(-2);
    let mySQLDate = [date.getFullYear(), month, day].join("-");
    let mySQLTime = [hours, minutes, seconds].join(":");
    return [mySQLDate, mySQLTime].join(" ");
}
async function addMinutes(dt, minutes,operation) {
    if(operation == 'subtract'){
        console.log(`Subtract`);
        let temp = new Date(dt.getTime() - minutes*60000);
        console.log(`Temp ----> ${temp}`);
        let modified_date = await convertDatePickerTimeToMySQLTime(temp)
        return modified_date
    }
    if(operation == 'add'){
        console.log(`add`);
        let temp = new Date(dt.getTime() + minutes*60000);
        let modified_date = await convertDatePickerTimeToMySQLTime(temp)
        return modified_date
    }
}
function dateZeroFix(date){
    date = date.toString()
    date = date.split("-")
    //console.log(`date -----> ${date[1]}`);
    let year_part = date[0].toString()
    let month_part = date[1].toString()
    let day_part = date[2].toString()

    if(month_part.length < 2 ){
        month_part = `0${month_part}`
    }
    if(day_part.length < 2 ){
        day_part = `0${day_part}`
    }
    date = `${year_part}-${month_part}-${day_part}`
    //console.log(`Month ---> ${month_part} Day ----> ${day_part}`);
    return date
}

function utcTodayDatetime(){
   
    return  moment.utc().format('YYYY-MM-DD HH:mm:ss');
   
} 
function getYear(milliseconds) {
    return moment(milliseconds).format('YYYY');
  }
function getMonth(milliseconds) {
    return moment(milliseconds).format('MMMM');
  }

function timestampToDate(timestamp,format){
    timestamp = removeMiliSec(timestamp)
    
    return moment.unix(timestamp).format(format);
}
function todayDate(){
   
    return  moment().format('YYYY-MM-DD');
}

function utcTodayDate(){
    return moment.utc().format('YYYY-MM-DD');
}

function currentMonth(){
   
    return  moment().format('MM');
   
}

function todayDatetime(){
   
    return  moment().format('YYYY-MM-DD HH:mm:ss');
   
} 

function WeekLateDatetime(){
    return  moment().subtract(7,'d').format('YYYY-MM-DD HH:mm:ss');
   
} 

function ISOtoLocal(date){
    let d = new Date(date);
    return d.getFullYear()+"-"+parseInt(d.getMonth()+1)+'-'+d.getDate()
}

function getDates(day, till_date_timestamp, from_date_timestamp) {
    allDates = [];
    try{
        from_date_timestamp = removeMiliSec(from_date_timestamp)
        var monday = moment.unix(from_date_timestamp)
        .startOf('month')
        .day(day);
        if (monday.date() > 7) monday.add(7,'d');
        //till_date_timestamp = moment(till_date).format('X');
    
        while (till_date_timestamp > moment(monday).format('X')) {
           // if (moment(monday).format('X') > from_date_timestamp) {

                allDates.push(moment(monday).format('YYYY-MM-DD'));
                monday.add(7, 'd');
           // }
        }
    }catch(e){
        console.log(e);
    }
    console.log(allDates);
    return allDates;
}

function removeMiliSec(timestamp) {
    
    if (typeof (timestamp) == 'string' && timestamp.length == 13) {
        timestamp = timestamp.substring(0, timestamp.length - 3);
    } else if (typeof (timestamp) == 'number'  && timestamp.toString().length == 13) {
        timestamp = timestamp.toString().substring(0, timestamp.toString().length - 3);
    }
    return timestamp;
}