//保存月份
let monthNums = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let nowDate = new Date();

let nowYear = nowDate.getFullYear();
let nowMonth = nowDate.getMonth();


//根据年份和月份获取当月的第一天是周几
function dayStart(year,month) {
    let day = new Date(year,month,1);
    return day.getDay();

}

//根据年份判断某月有多少天
function monthDays(year,month) {
    let flag1 = year%4==0;
    let flag2 = year%100!=0;
    let flag3 = year%400==0;
    if((flag1&&flag2)||flag3){
        monthNums[1] = 29;
    }else {
        monthNums[1] = 28;
    }
    return monthNums[month];
}

//绘制日历
function render(year,month) {
    let nowDate = new Date();
    let nowDay = nowDate.getDate();
    let firstDay = dayStart(year,month);
    let allDay = monthDays(year,month);
    let allLis = document.querySelectorAll(".bottom .days>li");
    let n = 1;
    for(let i = firstDay-1;i<firstDay+allDay-1;i++){
        allLis[i].innerText = n;
        n++;
    }
}
render(2018,11);


