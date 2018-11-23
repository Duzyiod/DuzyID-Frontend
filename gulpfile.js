'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('minify', function() {
    return gulp.src('src/duzy-id.js')
        .pipe(rename('duzy-id.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('lib'));
});

gulp.task('default', ['minify']);
