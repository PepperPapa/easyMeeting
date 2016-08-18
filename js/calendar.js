
$(function() {
  // 全局元素
  var $calendar_title = $(".js-calendar-title");
  var $calendar_week_view = $(".calendar-week-view");
  var $calendar_weeks_wrapper = $(".calendar-weeks-wrapper");
  var $one_week = $(".week");
  var $day_col = $(".week .day-col");

  /*
   * 根据calendar相关dom元素的name属性解析相应的日期信息：年、月、日
   * name_attr: 日期的毫秒字符串表示，如"1470931200000"
   */
  function parseTime(name_attr) {
    var date = new Date(Number(name_attr));
    return {
      "time": date.getTime(),
      "year": date.getFullYear(),
      "month": date.getMonth() + 1,  // 月份从1开始
      "date": date.getDate(),
      "day": date.getDay()
    };
  }

  /*
   * 获取当日所在的年、月、日、星期几等信息
   */
  function parseToday() {
    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    today = today.getTime();
    return parseTime(today.toString());
  }

  /*
   * 获取name_attr所在周的第一天（即周日）的时间毫秒数
   * name_attr: 日期的毫秒字符串表示，如"1470931200000"
   */
  function getStartWeekTime(name_attr) {
    var date = parseTime(name_attr);
    var start_day = new Date(date.year, date.month - 1, date.date - date.day);
    return start_day.getTime();
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
    var current_start_time = getStartWeekTime(parseToday().time);

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


  /*
   * 加载index.html页面检查cookie信息确定用户名和登录状态
   * cookie需包含两条选项：username, islogin
   */
  function updateUserFromCookie() {
    // 读取cookie
    var cookie = document.cookie;

    if (cookie.length > 0) {
      // 解析cookie为hash形式对象
      cookie = cookie.split(";");
      var dict_cookie = {};
      cookie.map(function(item) {
        var tem = item.trim().split("=");
        dict_cookie[tem[0]] = tem[1];
      });

      if (JSON.parse(dict_cookie.islogin)) {
	$("a.register").text(dict_cookie.name)
	               .attr("href", "#");
	$("a.login").text("注销");
      }
    }
  }
  
  updateUserFromCookie();

  // 注销登录处理(仅修改islogin的状态为false)
  $("a.login").on("click", function() {
    if (this.text === "注销") {
      document.cookie = "islogin=false";
    }
  });

  // 根据浏览器窗口变化动态计算week视图下的各元素宽度
  $(window).on("resize", function() {
    // 获取.calendar-week-view元素的当前宽度
    var last_week_width = $one_week.width();

    // 获取当前.calendar_weeks_wrapper当前显示的page值
    var current_week_page = 2;
    if ($calendar_weeks_wrapper.css("left") !== "auto") {
      current_week_page = Math.floor(
                      Math.abs($calendar_weeks_wrapper.css("left").slice(0, -2))
                      / last_week_width);
    }

    // 获取一周所占据的窗口宽度 = .calendar-content元素的宽度
    var new_week_width = $calendar_week_view.width();
    // 计算week元素宽度变化量
    var offset_width = current_week_page * (new_week_width - last_week_width);

    // 更新.calendar-weeks-wrapper元素的css的left属性值
    $calendar_weeks_wrapper.css("left", "-=" + offset_width);

    // 设置包裹所有week的外层元素的宽度
    $calendar_weeks_wrapper.css("width", new_week_width * 5);

    // 设置每一有.week元素的宽度等于一周所占据的宽度
    $one_week.css("width", new_week_width);

    // 设置每一天.day-col所占的宽度 = （一周的宽度 - 所有margin的宽度） / 7
    var day_width = (new_week_width - 70) / 7;
    $day_col.css("width", day_width);
  }).trigger("resize");

  // 初始情况下不显示周视图
  $calendar_week_view.addClass("hide");
  // 周视图元素的日期和title初始化
  initCalendarDate($(".week"), 2, "week");
  // 月视图元素的日期和title初始化
  initCalendarDate($(".mweek"), 12, "month");

  // 切换至月视图
  var $calendar_month_view = $(".calendar-month-view");
  $("#btn-show-month").on("click", function() {
    if ($calendar_month_view.hasClass("hide")) {
      $calendar_week_view.addClass("hide");
      $calendar_month_view.removeClass("hide");
      $calendar_title.text($calendar_title.attr("title-month-view"));
    }
  });

  //切换至周视图
  $("#btn-show-week").on("click", function() {
    if ($calendar_week_view.hasClass("hide")) {
      $calendar_month_view.addClass("hide");
      $calendar_week_view.removeClass("hide");
      $calendar_title.text($calendar_title.attr("title-week-view"));

      // 刷新一次周视图元素的布局
      $(window).trigger("resize");
    }
  });

  // 月视图下点击某一天扩展显示
  $(".calendar-month-view").on("click", ".js-expand-day", function() {
    // 首先删除当前的active元素扩展显示
    $(".js-expand-day.active").removeClass("active")
                              .find(".card-info").addClass("hide");
    $(this).addClass("active")  // 该元素扩展显示
          .find(".card-info").removeClass("hide");
  });

  // 周视图下点击某一天扩展显示
  $(".calendar-week-view").on("click", ".js-expand-day", function() {
    // 首先删除当前的active元素扩展显示
    $(".js-expand-day.active").removeClass("active")
      .find(".card-info").addClass("hide");

    $(this).addClass("active")  // 该元素扩展显示
      .find(".card-info").removeClass("hide");
  });

  // 通过关闭按钮关闭某一天的扩展显示
  $(".calendar-content").on("click", ".close-btn", function() {
    $(this).parent().parent().removeClass("active")
      .find(".card-info").addClass("hide");
  });

  // 周视图、月视图某日扩展下点击预定会议室链接弹出预定会议室弹出框，采用事件委托方式
  var $pop_over = $(".pop-over");
  $(".calendar-content").on("click", ".link-book-meeting", function(e) {
    $pop_over.addClass("is-shown");
    // 如果以鼠标的x,y坐标为起点分别向右向下增加弹出的宽度和高度后超出了浏览器视口的范围
    // 则需要适当调整弹出框的位置以使弹出框能够完整显示
    if (e.clientX + $pop_over.width() > window.innerWidth) {
      $pop_over.css("left", "auto");   // left参数设为默认值， right参数优先
      $pop_over.css("right", 10 + "px");
    } else {
      $pop_over.css("right", "auto");
      $pop_over.css("left", e.clientX + "px");
    }

    if (e.clientY + $pop_over.height() > window.innerHeight) {
      $pop_over.css("top", "auto");  // top参数设为默认值， bottom参数优先
      $pop_over.css("bottom", 10 + "px");
    } else {
      $pop_over.css("bottom", "auto");
      $pop_over.css("top", e.clientY + "px");
    }
  });

  // 关闭按钮关闭预定会议室弹出框
  $(".pop-over .close-btn").on("click", function() {
    $(".pop-over").removeClass("is-shown");
  });

  // 月视图下上月按钮切换
  $(".previous-month").on("click", function() {
    if (!$(".calendar-month-view").hasClass("hide")) {
      updateCalendarDate($(".mweek"), -1);
    }
  });

  // 月视图下上月按钮切换
  $(".next-month").on("click", function() {
    if (!$(".calendar-month-view").hasClass("hide")) {
      updateCalendarDate($(".mweek"), +1);
    }
  });

  // 周视图下上周按钮切换
  $(".previous-week").on("click", function() {
    // 周视图下的处理
    if (!$(".calendar-week-view").hasClass("hide")) {
      // 获取.week元素
      var $el_week = $(".calendar-week-view .week");
      // .week元素的宽度
      var width_of_week = $el_week[0].clientWidth;

      // 计算目前显示的是第几个.week元素
      var current_page = $(".calendar-weeks-wrapper").css("left").slice(1, -2) / width_of_week;
      if (current_page > 1) {
        if (!$(".calendar-weeks-wrapper").is(":animated")) {
          $(".calendar-weeks-wrapper").animate({"left": "+=" + width_of_week}, "slow");
        }
        // 更新calendar title显示的日期范围
        setWeekTitle($(".week").eq(current_page - 1).attr("name"));
      } else if (current_page === 1) {
        // 以下处理主要使为了实现和其他情况一样的动画滚动效果，page 0是预留的缓冲部分
        if (!$(".calendar-weeks-wrapper").is(":animated")) {
          $(".calendar-weeks-wrapper").animate({"left": "+=" + width_of_week},
            {
              duration: "slow",
              complete: function() {
                $(".calendar-weeks-wrapper").css("left", "-=" + width_of_week);
                updateWeekNameAttr("backward");
                // 更新calendar title显示的日期范围
                setWeekTitle($(".week").eq(current_page).attr("name"));
              }
            });
        }
      }
    }
  });

  // 周视图下下周按钮切换
  $(".next-week").on("click", function() {
    // 周视图下的处理
    if (!$(".calendar-week-view").hasClass("hide")) {
      // 获取.week元素
      var $el_week = $(".calendar-week-view .week");
      // .week元素的宽度
      var width_of_week = $el_week[0].clientWidth;
      // .week元素的数量
      var num_of_weeks = $el_week.length;

      // 计算目前显示的是第几个.week元素
      var current_page = $(".calendar-weeks-wrapper").css("left").slice(1, -2) / width_of_week;
      if (current_page < (num_of_weeks - 2)) {
        if (!$(".calendar-weeks-wrapper").is(":animated")) {
          $(".calendar-weeks-wrapper").animate({"left": "-=" + width_of_week}, "slow");
        }
        // 更新calendar title显示的日期范围
        setWeekTitle($(".week").eq(current_page + 1).attr("name"));
      } else if (current_page === (num_of_weeks - 2)) {
        // 以下处理主要使为了实现和其他情况一样的动画滚动效果，page 0是预留的缓冲部分
        if (!$(".calendar-weeks-wrapper").is(":animated")) {
          $(".calendar-weeks-wrapper").animate({"left": "-=" + width_of_week},
            {
              duration: "slow",
              complete: function() {
                $(".calendar-weeks-wrapper").css("left", "+=" + width_of_week);
                updateWeekNameAttr("forward");
                // 更新calendar title显示的日期范围
                setWeekTitle($(".week").eq(current_page).attr("name"));
              }
            });
        }
      }
    }
  });


  // 周视图回到今天按钮点击处理
  $(".back-to-today").on("click", function() {
    if (!$(".calendar-week-view").hasClass("hide")) {
      // week视图下日历title、日期、当天背景颜色等初始化
      initCalendarDate($(".week"), 2, "week");
    } else {
      // month视图下日历title、日期、当前背景颜色等初始化
      initCalendarDate($(".mweek"), 12, "month");
    }
  });

  // 月视图下.scroll-bar-ver的scroll事件处理
  // 1. 某一月的.day-cell元素的背景颜色，title随着scroll事件进行改变。
  // 2. 到达上下边界位置的日期和title刷新。
  $(".scroll-bar-ver").on("scroll", function() {
    // scrollTop所对应的行数位置
    var row_scrollTop = parseInt(this.scrollTop / $(".mweek").height());
    // .in-month类的第一个元素所在行数位置
    var row_first_in_month = parseInt($(".in-month:first").index(".day-cell") / 7);
    // .in-month类的最后一个元素所在行数位置
    var row_last_in_month = parseInt($(".in-month:last").index(".day-cell") / 7);

    // 需向上一月刷新样式和title
    if ((row_scrollTop - row_first_in_month) < -2) {
      if (row_scrollTop < 4) {
        updateCalendarDate($(".mweek"), -1);
      } else {
        updateShowMonth("backward");
      }
    }

    // 需向下一月刷新样式和title
    if ((row_scrollTop - row_last_in_month) > -1) {
      if (row_scrollTop > 15) {
        updateCalendarDate($(".mweek"), 1);
      } else {
        updateShowMonth("forward");
      }
    }
  });

  // 预定会议室弹出框的select选项处理
  $(".js-select-list").on("change", function(e) {
    $(this).prev().text(this.value);
  });

  // 会议室预定按钮点击处理效果
  $(".btn-book-meeting").on("click", function(e) {
    var meeting_card_template =
    "<div class=meeting-card>" +
        "<div class=card-title>{{title}}</div>" +
        "<div class=card-info>" +
          "<div><span class='badge badge-normal'>{{room}}</span></div>" +
          "<span class='badge badge-danger'>{{start}}</span><span class=badge>{{end}}</span>" +
          "</div>" +
      "</div>";

    meeting_card_template = meeting_card_template.replace(/{{title}}/, $(".input-meeting-title").val());
    meeting_card_template = meeting_card_template.replace(/{{room}}/, $(".js-list-value").eq(0).text());
    meeting_card_template = meeting_card_template.replace(/{{start}}/, $(".js-list-value").eq(1).text());
    meeting_card_template = meeting_card_template.replace(/{{end}}/, $(".js-list-value").eq(2).text());
    $(".calendar-day.active .meeting-lists").append(meeting_card_template);
  });
});
