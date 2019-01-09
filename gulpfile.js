/**********************************************************************************
 *
 * Duzy iOD, LLC CONFIDENTIAL
 * __________________
 *
 * Copyright Duzy iOD, LLC. All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property
 * of Duzy iOD, LLC unless otherwise noted.
 *
 * The intellectual and technical concepts contained herein are proprietary
 * to Duzy iOD, LLC and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 *
 * Dissemination of this information or reproduction of this material is strictly
 * forbidden unless prior written permission is obtained from Duzy iOD, LLC.
 * This file is subject to the full terms and conditions defined
 *
 * ***********************************************************************************
 * System Component: Duzy ID
 * Module Name: Gulpfile
 * Original Author: Andrii Sokoltsov
 *
 * Description: DuzyID FrontEnd code to enable Duzy products and checkout functionality over video player.
 *
 ************************************************************************ */

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
