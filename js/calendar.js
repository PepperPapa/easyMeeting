
$(function() {
  // week view
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
  }).trigger("resize");
});
