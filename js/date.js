/*
* 日历月视图、周视图日期相关函数处理
*/

// 获取今天的年、月、日、星期几等信息
function parseToday() {
  var today = Date.now();
  return parseTime(today.toString());
}

// 获取当前所在周的开始毫秒表示的时间，即周日0点0时0分
function getCurrentWeekStartTime() {
  var today = parseToday();
  var start_day = new Date(today.year, today.month - 1, today.date - today.day);
  return start_day.getTime();
}

// 根据calendar相关dom元素的name属性解析相应的日期信息：年、月、日
function parseTime(name_attr) {
  var date = new Date(Number(name_attr));
  return {
    "year": date.getFullYear(),
    "month": date.getMonth() + 1,
    "date": date.getDate(),
    "day": date.getDay()
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

// 更新周视图下的日期显示
function initWeekView() {
  // 初始化week视图日期和日历title显示
  // 初始情况下，today所在的week处在中间的.week元素中，目前设计共5个.week元素
  var init_page = 2;
  $(".calendar-weeks-wrapper").animate({"left": -init_page * $(".week").width()});
  var day_time = 86400000;
  var week_time = day_time * 7;
  var current_start_time = getCurrentWeekStartTime();
  $(".week").each(function(page) {
    var $self = $(this);
    $self.attr("name", current_start_time + (page - init_page) * week_time);
    $self.children().each(function(index) {
      var name_attr = Number($self.attr("name")) + index * day_time;
      $(this).attr("name", name_attr);
      $(this).find(".date").text(parseTime(name_attr).date);
    });
  });

  // 更新calendar-tile信息
  var $current_week = $(".week").eq(init_page);
  setCalendarTitle($current_week.attr("name"));

  // 为当天的.day-col元素添加today类名，以更新today的css样式
  $current_week.children().eq(parseToday().day).addClass("today");
}
