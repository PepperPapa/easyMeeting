
$(function() {
  // 周视图相关元素
  var $calendar_week_view = $(".calendar-week-view");
  var $calendar_weeks_wrapper = $(".calendar-weeks-wrapper");
  var $one_week = $(".week");
  var $day_col = $(".week .day-col");

  // 根据浏览器窗口变化动态计算week视图下的各元素宽度
  $(window).on("resize", function() {
    // 获取.calendar-week-view元素的当前宽度
    var last_week_width = $one_week.width();
    console.log(last_week_width, $calendar_week_view.width());

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
  initWeekView();

  // 切换至月视图
  var $calendar_month_view = $(".calendar-month-view");
  $("#btn-show-month").on("click", function() {
    if ($calendar_month_view.hasClass("hide")) {
      $calendar_week_view.addClass("hide");
      $calendar_month_view.removeClass("hide");
    }
  });

  //切换至周视图
  $("#btn-show-week").on("click", function() {
    if ($calendar_week_view.hasClass("hide")) {
      $calendar_month_view.addClass("hide");
      $calendar_week_view.removeClass("hide");

      // 刷新一次周视图元素的布局
      $(window).trigger("resize");
    }
  });

  // 月视图下点击某一天扩展显示
  $(".calendar-month-view").on("click", ".js-expand-day", function() {
    // 首先删除当前的active元素扩展显示
    $(".js-expand-day.active").removeClass("active");
    $(this).addClass("active");  // 该元素扩展显示
  });

  // 周视图下点击某一天扩展显示
  $(".calendar-week-view").on("click", ".js-expand-day", function() {
    // 首先删除当前的active元素扩展显示
    $(".js-expand-day.active").removeClass("active");
    $(this).addClass("active");  // 该元素扩展显示
  });

  // 通过关闭按钮关闭某一天的扩展显示
  $(".calendar-content").on("click", ".close-btn", function() {
    $(this).parent().parent().removeClass("active");
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
        $(".calendar-weeks-wrapper").animate({"left": "+=" + width_of_week}, "slow");
        // 更新calendar title显示的日期范围
        setCalendarTitle($(".week").eq(current_page - 1).attr("name"));
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
        $(".calendar-weeks-wrapper").animate({"left": "-=" + width_of_week}, "slow");
        // 更新calendar title显示的日期范围
        setCalendarTitle($(".week").eq(current_page + 1).attr("name"));
      }

    }
  });


  // 周视图回到今天按钮点击处理
  $(".back-to-today").on("click", function() {
    // week视图下日历title、日期、当天背景颜色等初始化
    initWeekView();
  });

});
