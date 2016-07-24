/*
* 日历月视图、周视图日期相关函数处理
*/

// 获取今天的年、月、日、星期几等信息
function parseToday() {
  var today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  today = today.getTime();
  return parseTime(today.toString());
}

// 获取当前所在周的开始毫秒表示的时间，即周日0点0时0分
function getCurrentWeekStartTime() {
  var today = parseToday();
  var start_day = new Date(today.year, today.month - 1, today.date - today.day);
  return start_day.getTime();
}

// TODO： zx 该函数要和getCurrentWeekStartTime合并
function getStartWeekTime(name_attr) {
  var date = parseTime(name_attr);
  var start_day = new Date(date.year, date.month - 1, date.date - date.day);
  return start_day.getTime();
}

// 根据calendar相关dom元素的name属性解析相应的日期信息：年、月、日
function parseTime(name_attr) {
  var date = new Date(Number(name_attr));
  return {
    "time": date.getTime(),
    "year": date.getFullYear(),
    "month": date.getMonth() + 1,
    "date": date.getDate(),
    "day": date.getDay()
  };
}

// 根据当前显示的.week元素的name属性更新calendar tile的信息
function setWeekTitle(week_attr_name) {
  var day_time = 86400000;
  var start_date = parseTime(week_attr_name);
  var end_date  = new Date(Number(week_attr_name) + 6 * day_time);
  var title = [start_date.year, start_date.month, start_date.date].join(".")
               + "-" + [end_date.getFullYear(), end_date.getMonth() + 1,
                 end_date.getDate()].join(".");
  $(".js-calendar-title").text(title)
                         .attr("title-week-view", title);
}

/*
* 月视图、周视图日历日期相关的初始化处理
* $weeks: 表示月视图、周视图下的weeks jQuery对象
* center_pos: 表示当前周设计所在元素的index位置
* view: "week"-weekview, "month"-monthview
*/
function initCalendarDate($weeks, center_pos, view) {
  if (view === "week") {
    // 初始情况下，today所在的week处在中间的.week元素中，目前设计共5个.week元素
    if (!$(".calendar-weeks-wrapper").is(":animated")) {
      $(".calendar-weeks-wrapper").animate({"left": -center_pos * $(".week").width()});
    }
  }

  var day_time = 86400000;
  var week_time = day_time * 7;
  var current_start_time = getCurrentWeekStartTime();

  $(".in-month").removeClass("in-month");  // 先清除已有的in-month类

  $weeks.each(function(page) {
    var $self = $(this);
    $self.attr("name", current_start_time + (page - center_pos) * week_time);
    $self.children().each(function(index) {
      var name_attr = Number($self.attr("name")) + index * day_time;
      $(this).attr("name", name_attr);
      $(this).find(".date").text(isFirstDay(name_attr) +
                                 isLastDay(name_attr) +
                                 parseTime(name_attr).date);

      if (view === "month") {
        // 月视图下需要当前月添加.in-month类样式，加深背景色以示区分
        var today = parseToday();
        var date_daycell = parseTime(name_attr);
        if ((today.year == date_daycell.year) && (today.month == date_daycell.month)) {
          $(this).addClass("in-month");
        }
      }
    });
  });

  // 更新calendar-tile信息
  var $current_week = $weeks.eq(center_pos);
  if (view === "week") {
    setWeekTitle($current_week.attr("name"));
  } else {
    setMonthTitle($current_week.attr("name"));
    // 设置scroll-bar的位置使当天能够显示出来
    setScrollTop(10);
  }

  // 为当天的.day-col元素添加today类名，以更新today的css样式
  $current_week.children().eq(parseToday().day).addClass("today");
}

/*
* 设置月视图下scroll-bar的位置
* row：表示week元素的行号，从0开始
*/
function setScrollTop(row) {
  var $scroll_bar_vertical =  document.querySelector(".scroll-bar-ver");
  var daycell_height = document.querySelector(".mweek").clientHeight;
  $scroll_bar_vertical.scrollTop = row * daycell_height;
}

// 刷新当前显示的月份样式和title
// dir: backward, forward
function updateShowMonth(dir) {
  if (dir === "backward") {
    var end_index_last_month = $(".in-month:first").index(".day-cell") - 1;
    var $end_last_month = $(".day-cell").eq(end_index_last_month);
    var days_last_month = parseTime($end_last_month.attr("name")).date;
    var start_index_last_month = end_index_last_month - days_last_month;
    $(".in-month").removeClass("in-month");
    // 刷新日历title值
    setMonthTitle($end_last_month.attr("name"));
    for (var i = end_index_last_month; i > start_index_last_month; i--) {
      $(".day-cell").eq(i).addClass("in-month");
    }
  } else {
    var start_index_next_month = $(".in-month:last").index(".day-cell") + 1;
    // 刷新日历title值
    setMonthTitle($(".day-cell").eq(start_index_next_month).attr("name"));
    $(".in-month").removeClass("in-month");
    // 每月最大天数为31天，最大循环次数为31次
    for (var j = start_index_next_month; j < start_index_next_month + 31; j++) {
      var $day_cell_index = $(".day-cell").eq(j);
      $day_cell_index.addClass("in-month");
      if (($day_cell_index.find(".date").text().length > 2) &&
         (j > start_index_next_month)) {
        break;
      }
    }
  }
}

function setMonthTitle(name_attr) {
  var start_date = parseTime(name_attr);
  var title = [start_date.year, start_date.month].join("-");
  $(".js-calendar-title").text(title)
                         .attr("title-month-view", title);
}

// 判断name_attr代表的日期是否为当月一天
function isFirstDay(name_attr) {
  var date = new Date(Number(name_attr));
  if (Number(date.getDate()) === 1) {
    return date.toString().split(" ")[1] + " ";
  } else {
    return "";
  }
}

// 判断name_attr代表的日期是否为当月最后一天
function isLastDay(name_attr) {
  var date = new Date(Number(name_attr));
  var next_date = new Date(date.getTime() + 86400000);
  if (Number(next_date.getDate()) === 1) {
    return date.toString().split(" ")[1] + " ";
  } else {
    return "";
  }
}

/*
* 周视图下设计共包含5个.week元素 0，1，2，3，4
* 1.如当前在第1页继续回退则需要刷新所有的name属性值，己日期毫秒数均减少一个day_time或week_time
* 2.如当前在第3页继续回退则需要刷新所有的name属性值，己日期毫秒数均增加一个day_time或week_time
* 之所以这么设计是为了保持动画效果的一致
* back_or_forward:  -1: 表示回退； 1：表示向前
*/
function updateWeekNameAttr(back_or_forward) {
  var direction;
  if (back_or_forward === "backward") {
    direction = -1;
  } else {
    direction = 1;
  }
  var day_time = 86400000;
  var week_time = day_time * 7;

  // 由于日期发生了变动，要取消当前的today样式
  $(".week .today").removeClass("today");
  $(".week").each(function() {
    $(this).attr("name",  Number($(this).attr("name")) + direction * week_time);
    $(this).children().each(function() {
      var name_attr = Number($(this).attr("name")) + direction * week_time;
      $(this).attr("name", name_attr);
      $(this).find(".date").text(isFirstDay(name_attr) +
                                 isLastDay(name_attr) +
                                 parseTime(name_attr).date);
      // 更新today样式到新的元素
      if (name_attr == parseToday().time) {
        $(this).addClass("today");
      }
    });
  });
}

/*
* 月视图下上下滚动条滚动到边界时需要刷新日期信息
* 实现思路：
* 1.无论是向上一月或下一月刷新，都以当前显示月的第一天为起点，获取当月第一天的name值
* 2.根据该name表示的时间计算出上一月或下一月的第一天的值,使用setMonth()。
* 3.将新name值作为基准，更新到中间的.mweek元素即行号（12），依次计算出所有元素的name值。
* 4.根据.day-cell元素的name值刷新日期信息和title信息。
* 5.scrollTop的位置定位到新显示月的第一天所在的行。
* dir: -1-上一月， 1-下一月
*/
function updateCalendarDate($weeks, dir) {
  var $start_in_month = $(".in-month");
  var next_month_start = new Date(Number($start_in_month.attr("name")));
  next_month_start.setMonth(next_month_start.getMonth() + dir);
  var current_show_month = parseTime(next_month_start.getTime());    

  var center_pos = 12;
  var day_time = 86400000;
  var week_time = day_time * 7;
  var current_start_time = getStartWeekTime(next_month_start.getTime());
 
  //清空.in-month类的day-cell元素
  $(".in-month").removeClass("in-month");
  $(".mweek .today").removeClass("today");

  $weeks.each(function(page) {
    var $self = $(this);
    $self.attr("name", current_start_time + (page - center_pos) * week_time);
    $self.children().each(function(index) {
      var name_attr = Number($self.attr("name")) + index * day_time;
      $(this).attr("name", name_attr);
      $(this).find(".date").text(isFirstDay(name_attr) +
                                 isLastDay(name_attr) +
                                 parseTime(name_attr).date);

      // 月视图下需要当前显示月添加.in-month类样式，加深背景色以示区分
      var date_daycell = parseTime(name_attr);
      if ((date_daycell.year === current_show_month.year) &&
         (date_daycell.month === current_show_month.month)) {
        // console.log(date_daycell.year, date_daycell.month);
        $(this).addClass("in-month");
      }

      // 更新today样式到新的元素
      if (name_attr == parseToday().time) {
        $(this).addClass("today");
      }
    });
  });


  // 更新calendar-tile信息
  setMonthTitle(current_show_month.time);
  // 设置scroll-bar的位置使当天能够显示出来
  setScrollTop(12);

}
