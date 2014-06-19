'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var paths = {
  'srcFiles': ['./**/*.js', '!node_modules{,/**}']
};

gulp.task('default', ['lint']);

gulp.task('lint', function lint(){
  gulp.src(paths.srcFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});