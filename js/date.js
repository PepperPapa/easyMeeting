/*
* 日历月视图、周视图日期相关函数处理
*/

// 获取当前所在周的开始毫秒表示的时间，即周日0点0时0分
function getCurrentWeekStartTime() {
  var today = new Date();
  var start_day = new Date(today.getFullYear(),
                           today.getMonth(),
                           today.getDate() - today.getDay());
  return start_day.getTime();
}

// 根据calendar相关dom元素的name属性解析相应的日期信息：年、月、日
function parseTime(name_attr) {
  var date = new Date(Number(name_attr));
  return {
    "year": date.getFullYear(),
    "month": date.getMonth() + 1,
    "date": date.getDate()
  };
}

// 根据当前显示的.week元素的name属性更新calendar tile的信息
function setCalendarTitle(week_attr_name) {
  var day_time = 86400000;
  var start_date = parseTime(week_attr_name);
  var end_date  = new Date(Number(week_attr_name) + 6 * day_time);
  var title = [start_date.year, start_date.month, start_date.date].join(".")
               + "-" +
               [end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate()].join(".");
  $(".js-calendar-title").text(title);
}
