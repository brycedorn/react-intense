var gulp = require('gulp');
var react = require('gulp-react');
var webpack = require('webpack');
var runSequence = require('run-sequence');

gulp.task('build', function(callback) {
  return gulp.src(__dirname + '/src/*.js')
    .pipe(react({harmony: true}))
    .pipe(gulp.dest(__dirname + '/lib'));
});

gulp.task('dev', function(callback) {
  runSequence('webpack:build', 'copy-vendor', 'copy-examples', 'webpack:dev-server', callback);
});
