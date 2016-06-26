// 根据浏览器窗口变化实时控制calendar显示高度始终占据满屏，不出现滚动条
var $calendar_area = $(".scroll-bar");
$(window).on("resize", function(event) {
  var height = $(window).height() - $("header").height()
                             - $(".calendar-header").height();
  $calendar_area.attr("height", height);
}).trigger("resize");
