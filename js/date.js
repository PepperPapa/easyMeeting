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
  console.log(row, daycell_height);
  $scroll_bar_vertical.scrollTop = row * daycell_height;
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
