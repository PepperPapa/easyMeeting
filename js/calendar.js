
$(function() {
  // 周视图相关元素
  var $calendar_week_view = $(".calendar-week-view");
  var $calendar_weeks_wrapper = $(".calendar-weeks-wrapper");
  var $one_week = $(".week");
  var $day_col = $(".week .day-col");

  // 根据浏览器窗口变化动态计算week视图下的各元素宽度
  $(window).on("resize", function() {
    // 获取一周所占据的窗口宽度 = .calendar-content元素的宽度
    var week_width = $calendar_week_view.width();

    // 设置包裹所有week的外层元素的宽度
    $calendar_weeks_wrapper.css("width", week_width * 5);

    // 设置每一有.week元素的宽度等于一周所占据的宽度
    $one_week.css("width", week_width);

    // 设置每一天.day-col所占的宽度 = （一周的宽度 - 所有margin的宽度） / 7
    var day_width = (week_width - 70) / 7;
    $day_col.css("width", day_width);
  });

  // 页面初次加载需要设置week视图的UI元素的宽度
  $(window).trigger("resize");

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
      $(window).trigger("resize");    // week视图显示需要触发一次刷新
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
});
