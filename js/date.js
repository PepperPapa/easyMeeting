/*
* 日历月视图、周视图日期相关函数处理
*/

function getTodayTime() {
  var today = new Date();
  // 创建今天的00：00：00时刻的Date对象
  var start_today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // 返回该对象的毫秒数表示
  return start_today.getTime();
}

console.log(getTodayTime());
