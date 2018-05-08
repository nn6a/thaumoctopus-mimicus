import gulp from 'gulp'
import babel from 'gulp-babel'
import nodemon from 'gulp-nodemon'
import sequence from 'run-sequence'
import browseryfy from 'browserify'
import source from 'vinyl-source-stream'

gulp.task('copy', () => {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
})

gulp.task('compile', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist'))
})

gulp.task('bundle', () => {
    const b = browseryfy({
        entries: 'src/index.js',
        debug: true
    }).transform('babelify', {presets: ['env']})

    return b.bundle()
        .pipe(source('build/application.js'))
        .pipe(gulp.dest('dist'))
})

gulp.task('watch', () => {
    gulp.watch('src/**/*.js', ['compile', 'bundle'])
    gulp.watch('src/**/*.html', ['copy'])
})

gulp.task('start', () => {
    nodemon({
        watch: 'dist',
        script: 'dist/index.js',
        ext: 'js html',
        env: {'NODE_ENV': 'development'}
    })
})

gulp.task('default', (callback) => {
    sequence(['compile', 'watch', 'copy', 'bundle'], 'start', callback)
})
