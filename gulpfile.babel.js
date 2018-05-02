import gulp from 'gulp'
import babel from 'gulp-babel'
import nodemon from 'gulp-nodemon'
import sequence from 'run-sequence'

gulp.task('compile', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist'))
})

gulp.task('watch', () => {
    gulp.watch('src/**/*.js', ['compile'])
})

gulp.task('start', () => {
    nodemon({
        watch: 'dist',
        script: 'dist/index.js',
        ext: 'js',
        env: {'NODE_ENV': 'development'}
    })
})

gulp.task('default', (callback) => {
    sequence(['compile', 'watch'], 'start', callback)
})
