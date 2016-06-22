var gulp = require('gulp');
var browserSync = require("browser-sync");
var reload = browserSync.reload;

gulp.task("default", ["watch", "serve"]);

gulp.task("serve", function() {
  browserSync.init({
    server: './'
  });
});

gulp.task("watch", function() {
  gulp.watch("*.html").on("change", reload);
  gulp.watch("css/*.css").on("change", reload);
  gulp.watch("js/*.js").on("change", reload);
});
