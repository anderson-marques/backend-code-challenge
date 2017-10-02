const gulp = require('gulp');
const mocha = require('gulp-mocha');
const del = require('del');


gulp.task('default', ['clean','build']);

gulp.task('clean', function() {
    return del(['build/**/*.*']);
});

gulp.task('build', ['clean'], function(){
        return gulp.src('src/**/*.*')
            .pipe(gulp.dest('build'))
    }
);