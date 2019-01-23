//设置当前时间
function setNowTime() {
    let yearEle = document.querySelector(".top .year");
    let monthEle = document.querySelector(".top .month");
    let todayEle = document.querySelector(".top .today");
    let hoursEle = document.querySelector(".top .hours");
    let minutesEle = document.querySelector(".top .minutes");
    let secondsEle = document.querySelector(".top .seconds");
    set();
    setInterval(set, 1000);

    function set() {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 1;
        let today = nowTime.getDate();
        let hours = nowTime.getHours();
        let minutes = nowTime.getMinutes();
        let seconds = nowTime.getSeconds();
        yearEle.innerText = year;
        monthEle.innerText = month;
        todayEle.innerText = today;
        hoursEle.innerText = zero(hours);
        minutesEle.innerText = zero(minutes);
        secondsEle.innerText = zero(seconds);
    }
}

//补0
function zero(nums) {
    return nums >= 10 ? nums : "0" + nums;
}

setNowTime();

//根据year和month获得当前月份的天数
function monthDays(year, month) {
    //保存月份对应的天数
    let monthNums = [31, "?", 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    //判断是否为闰年
    let flag1 = year % 4 === 0;     //能否被4整除
    let flag2 = year % 100 !== 0;   //能否不能被100整除
    let flag3 = year % 400 === 0;   //能否被400整除
    if ((flag1 && flag2) || flag3) {
        monthNums[1] = 29;
    } else {
        monthNums[1] = 28;
    }
    return monthNums[month];
}

//根据年和月获得当前月份的第一天是周几
function monthStart(year, month) {
    let time = new Date(year, month, 1);
    return time.getDay() === 0 ? 7 : time.getDay();
}

//渲染日历
function render(year, month) {
    let firstDay = monthStart(year, month);
    let allDays = monthDays(year, month);
    let lis = document.querySelectorAll(".bottom .days li");
    let titleYear = document.querySelector(".title .year");
    let titleMonth = document.querySelector(".title .month");
    let nowTime = new Date();
    titleYear.innerText = year;
    titleMonth.innerText = month + 1;
    lis.forEach((val) => {
        val.querySelector("div").innerText = "";
        val.querySelector("div").setAttribute("id", "");
        val.classList.remove("active");
    });
    let num = 1;    //第一天
    for (let i = firstDay - 1; i < allDays + firstDay - 1; i++) {
        if (nowTime.getFullYear() === year && nowTime.getMonth() === month && nowTime.getDate() === num) {
            lis[i].classList.add("active");
        }
        lis[i].querySelector("div").innerText = num;
        lis[i].querySelector("div").setAttribute("id", year + "_" + month + "_" + num);
        num++;
    }
}

//获得当前时间信息
let nowTime = new Date();
let nowYear = nowTime.getFullYear();
let nowMonth = nowTime.getMonth();
render(nowYear, nowMonth);
//获取切换日期的按钮
let btns = document.querySelectorAll(".btn>div");
//上一个月
btns[0].onclick = function () {
    nowMonth--;
    if (nowMonth < 0) {
        nowMonth = 11;
        nowYear--;
    }
    render(nowYear, nowMonth);
};
//下一个月
btns[1].onclick = function () {
    nowMonth++;
    if (nowMonth > 11) {
        nowMonth = 0;
        nowYear++;
    }
    render(nowYear, nowMonth);
};

let dayDiv = document.querySelectorAll(".days>li>div[id*='_']");
dayDiv.forEach((val) => {
    let time;
    val.onmousemove = function () {
        clearTimeout(time);
        time = setTimeout(() => {
            let tip = document.querySelector(".tip");
            if (tip) {
                tip.parentNode.removeChild(tip);
            }
            let div = document.createElement("div");
            div.innerHTML = `
                <div class='jiantou'></div>
                <div class="add">添加日程</div>
                <div class="select">查看日程</div>
`;
            div.classList.add("tip");
            this.appendChild(div);
        }, 500);
    };
    val.onmouseout = function () {
        clearTimeout(time);
    }
});
let bigBox = document.querySelector(".big-box");
let dateTime = "";
window.onclick = function (e) {
    let target = e.target;
    //跳转到添加日程页面
    if (target.classList.contains("add")) {
        bigBox.style.left = "0";
        dateTime = target.parentNode.parentNode.id;
    }
    //跳转到查看日程页面
    if (target.classList.contains("select")) {
        let data = localStorage.data ? JSON.parse(localStorage.data) : {};
        let today = target.parentNode.parentNode.id;
        console.log(today);
        let nowData = data[today];
        renderSchedule(nowData,today);
        bigBox.style.left = "-200%";
    }
    //点击其它地方移除提示
    if (!(target.classList.contains("tip"))) {
        let tip = document.querySelector(".tip");
        if (tip) {
            tip.parentNode.removeChild(tip);
        }
    }
    //保存信息
    if (target.classList.contains("save")) {
        /*
        * 获取旧数据
        *
        * */
        let data = localStorage.data;
        data = data ? JSON.parse(data) : {};

        /*
        * 获取需要添加的数据
        * */
        let nameEle = document.querySelector("#name");
        let desEle = document.querySelector("#des");
        let addressEle = document.querySelector("#address");
        let name = nameEle.value;
        let address = addressEle.value;
        let des = desEle.value;
        let obj = {
            name: name,
            address: address,
            des: des
        };
        if (dateTime in data) {
            data[dateTime].push(obj);
        } else {
            data[dateTime] = [obj];
        }
        localStorage.data = JSON.stringify(data);
        nameEle.value = "";
        desEle.value = "";
        addressEle.value = "home";
        bigBox.style.left = "-100%";
    }
};
let box = document.querySelector(".box");
window.onkeydown = function (e) {
    /*
    * 返回日历页面
    * */
    if (e.keyCode === 27 && bigBox.offsetLeft !== box.offsetWidth) {
        bigBox.style.left = "-100%";
    }

}

/*
* 遍历日程
* */
function renderSchedule(data,today) {
    let ul = document.querySelector(".schedule-box ul");
    let addressObj = {
      school:"学校",
      home:"家",
      company:"公司"
    };
    today = today.split("_");
    ul.innerHTML = "";
    if(!data){
        ul.innerHTML = "<div style='color: #fff;font-size: 30px;text-align: center;'>没有日程安排</div>";
    }else {
        data.forEach((val) => {
            let li = document.createElement("li");
            li.innerHTML = `
                <div class="schedule-box-top">
                    <span>${val.name}</span>
                    <i>${today[0]}年${today[1]+1}月${today[2]}号</i>
                    <em>${addressObj[val.address]}</em>
                </div>
                <p>${val.des}</p>
            `;
            ul.appendChild(li);
        });
    }

}





