var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/**').on('change', livereload.changed);
});

gulp.task('default',gulp.series('watch'));
