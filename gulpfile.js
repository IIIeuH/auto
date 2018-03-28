const   gulp         = require('gulp'),
        cleanCss     = require('gulp-cssnano'),
        del          = require('del'),
        concatCss    = require('gulp-concat-css'),
        uglify       = require('gulp-uglify'),
        concat       = require('gulp-concat'),
        autoprefixer = require('gulp-autoprefixer'),
        babel = require('gulp-babel');


gulp.task('concatCss', () => {
    return [gulp.src(['public/stylesheets/**/*.css'])
        .pipe(concatCss('bundleMain.min.css'))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cleanCss())
        .pipe(gulp.dest('public/app/css/')) ,
        gulp.src([
            'node_modules/bootstrap/dist/css/bootstrap.css'
        ])
            .pipe(concatCss('bundleOther.min.css'))
            .pipe(cleanCss())
            .pipe(gulp.dest('public/app/css/'))];
});


gulp.task('clean', () => {
    return del.sync(['public/app/css/*.css', 'public/app/js/*.js', 'public/dist/css/*.css', 'public/dist/js/*.js']);
});

gulp.task('scriptOther', () => {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/popper.js/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        'node_modules/socket.io-client/dist/socket.io.js',
        'bower_components/moment/moment.js'

    ])
        .pipe(concat('other.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/app/js/'));
});

gulp.task('script', () => {
    return gulp.src([
        'public/javascripts/**/*.js'])
        .pipe(concat('main.min.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('public/app/js/'));
});



gulp.task('watch', () => {
    gulp.watch('public/stylesheets/**/*.css', ['concatCss']);
    gulp.watch('public/javascripts/**/*.js', ['script']);
});


gulp.task('build', ['clean', 'concatCss', 'scriptOther' ,'script'], () => {
    gulp.src('public/app/css/*.css');
    gulp.src('public/app/js/*.js');
    gulp.src('public/fonts/**/*');
});