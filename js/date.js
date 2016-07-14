/*
* 日历月视图、周视图日期相关函数处理
*/

var today = new Date();
// 得到今天是星期几，几号，月份，年
var today_day = today.getDay();
var today_date = today.getDate();
var today_month = today.getMonth() + 1;  // getMonth的范围是0～11
var today_year = today.getFullYear();

function get_this_week(today) {
  /*
    根据today的信息返回本周的所有Date数据，顺序从周日开始
  */
  var this_week = [];
  var copy_today = new Date(today);
  var start = new Date(copy_today.setDate(copy_today.getDate()
                                          - copy_today.getDay()));
  this_week.push(new Date(start));
  for (var i = 1; i < 7; i++) {
    start.setDate(start.getDate() + 1);
    this_week.push(new Date(start));
  }
  return this_week;
}

console.log(get_this_week(today));
