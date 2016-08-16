$(function() {
  var el_signup = document.querySelector(".to-signup");
  var el_signin = document.querySelector(".to-signin");
  var form_signup = document.getElementsByClassName("signup-form")[0];
  var form_signin = document.getElementsByClassName("signin-form")[0];
  var input_rember_me = document.querySelector("input[name=rember-me]");
  var lb_rember_me = document.querySelector("label[for=rember-me]");

  // 判断某个dom元素是否包含某个类名
  function hasClass(element, name) {
    var class_lists = element.classList;
    for (var i in class_lists) {
      if (name === class_lists[i]) {
        return true;
      }
    }
    return false;
  }

  // 点击注册进入注册页面处理
  el_signup.addEventListener("click", function() {
    if (hasClass(form_signup, "hide")) {
      // 增加signup相关的元素的显示及样式
      form_signup.className = form_signup.className.replace(/ hide/g, "");
      this.className += " active";


      // 取消signin相关的元素的显示及样式
      form_signin.className += " hide";
      el_signin.className = el_signin.className.replace(/ active/g, "");
    }
  });

  // 点击登录进入登录页面处理
  $(".to-signin").on("click", function() {
    if (hasClass(form_signin, "hide")) {
      // 增加signin相关的元素的显示及样式
      form_signin.className = form_signin.className.replace(/ hide/g, "");
      this.className += " active";


      // 取消signup相关的元素的显示及样式
      form_signup.className += " hide";
      el_signup.className = el_signup.className.replace(/ active/g, "");
    }
  });

  // 登录选项，点击label-"记住我"也设置为checkbox切换选中功能
  lb_rember_me.addEventListener("click", function() {
    input_rember_me.checked = !input_rember_me.checked;
  });

  /*
   * 注册和登录页面，用户名改变则初始化alert
   */
  $("input[name=username]").on("textInput", function() {
    // TODO: 每次输入文本都出发该事件是否合理哪?
    $(".alert").each(function() {
      this.className = "alert hide";
    });
  });

  /*
   * 点击注册按钮处理：ajax请求发往server端进行注册，server端返回json数据传达注册是否成功的信息
   */
  $(".btn-signup").on("click", function() {
    // 获取注册信息
    var signup_info = {};
    signup_info.name = $(".signup-input input").eq(0).val();
    signup_info.password = $(".signup-input input").eq(1).val();
    signup_info.verify = $(".signup-input input").eq(2).val();

    // 发送ajax请求到server进行用户注册
    $.ajax({
      method: "POST",
      url: "/signup",
      contentType: "application/json;charset='utf-8'",
      data: JSON.stringify(signup_info)
    }).done(function(response_body) {
      // 注册成功则切换至登录页面并自动补全用户名和密码
      if (response_body !== null) {
	$(".to-signin").trigger("click");
	$(".signin-input input").eq(0).val(signup_info.name);
	$(".signin-input input").eq(1).val(signup_info.password);
	$(".signin-form .alert").text("注册成功,请登录...")
	  .addClass("alert-success").removeClass("hide");
      // 注册失败则给出错误提示"用户名已经存在"
      } else {
	$(".signup-form .alert").text("用户名已经存在...")
	  .addClass("alert-warning").removeClass("hide");	
      }
    });
  });

  /*
   * 跳转到path指定的页面
   */
  function redirect(path) {
    window.location.pathname = path;
  }

  /*
   * 点击登录按钮处理：ajax请求发往server端进行登录处理，登录成功跳转到index.html页面，失败进行错误提示
   */
  $(".btn-signin").on("click", function() {
     // 获取登录信息
    var signin_info = {};
    signin_info.name = $(".signin-input input").eq(0).val();
    signin_info.password = $(".signin-input input").eq(1).val();

    // 发送ajax请求到server进行用户登录
    $.ajax({
      method: "POST",
      url: "/signin",
      contentType: "application/json;charset='utf-8'",
      data: JSON.stringify(signin_info)
    }).done(function(response_body) {
      // 登录成功则切换至index.html页面并显示在index.html页面显示用户信息
      if (response_body !== null) {
	redirect("/index.html");
      // 登录失败则给出错误提示"用户名或密码错误..."
      } else {
	$(".signin-form .alert").text("用户名或密码错误...")
	  .addClass("alert-warning").removeClass("hide");	
      }
    });
  });
});
