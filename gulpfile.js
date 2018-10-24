const gulp = require('gulp');
// 浏览器插件
const browserSync = require('browser-sync');
const reload = browserSync.reload;
// 其它插件
const del = require('del');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const combiner = require('stream-combiner2');
const useref = require('gulp-useref')
const log = log => {
  console.log(`👉👉👉${log}👈👈👈`);
};

// 开发部分
gulp.task('server', ['devScss'], () => {
  browserSync.init({
    server: './src',
    port: 8080, // 设置端口
    ghostMode: false, // 开启的话有一个设备 滚动(scroll)\点击(clicks)\forms 了页面其他设备也会有相同的行为
    notify: false // 不会在浏览器里显示任何提醒(开启的话每次刷新会有提示，在移动端下遮挡很严重)
  });
  gulp.watch('src/scss/*.scss', ['devScss'])
  gulp.watch([
    'src/*.html', 
    'src/page/*.html',
    'src/css/*.css',
    'src/js/*.js',
    'src/img/*'
  ])
    .on('change', reload)
})

gulp.task('devScss', function () {
  return combiner([
    gulp.src('./src/scss/*.scss'),
    sass(),
    autoprefixer({
      browsers: ['last 2 Explorer versions', 'Firefox >= 20', 'last 100 versions'],
      cascade: true
    }),
    gulp.dest('./src/css/')
  ]).on('error', console.error.bind(console));
});

// 构建部分
gulp.task('build', ['clearDist', 'scss', 'prefixer', 'buildFile'], () => {
  log('构建完成')
})

gulp.task('clearDist', () => {
  return new Promise((resolve) => {
    log('清除dist')
    del(['dist'])
      .then(() => {
        log('清除完成')
        resolve();
      })
  })
})

gulp.task('scss', ['clearDist'], () => {
  log('开始编译scss')
  return new Promise((resolve) => {
    gulp.src('./src/scss/*.scss')
      .pipe(sass({
          outputStyle: 'expanded'
        })
        .on('error: ', sass.logError))
      .pipe(gulp.dest('./src/css/'))
      .on('end', () => {
        log('scss编译完成');
        resolve();
      })
  })
});

gulp.task('prefixer', ['scss'], () => {
  log('autoprefixer 开始')
  return new Promise((resolve) => {
    gulp.src('./src/css/*.css')
      .pipe(autoprefixer({
        browsers: ['last 2 Explorer versions', 'Firefox >= 20', 'last 100 versions'],
        cascade: false
      }))
      .pipe(gulp.dest('./src/css/'))
      .on('end', () => {
        log('autoprefixer完成');
        resolve();
      })
  })

});

gulp.task('buildFile', ['prefixer'], () => {
  log('打包文件')
  // 写入index.html
  gulp.src('./src/*.html')
    .pipe(useref())
    .pipe(gulp.dest('./dist/'))
  // 写入page
  gulp.src('./src/page/*.html')
    .pipe(useref())
    .pipe(gulp.dest('./dist/page/'))
  // 写入img
  gulp.src('./src/img/*.html')
    .pipe(gulp.dest('./dist/img/'))
  // 写入css
  gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./dist/css/'))
  // 写入js
  gulp.src('./src/js/*.js')
    .pipe(gulp.dest('./dist/js/'))
    .on('end', () => {
      log('写入文件完成')
    })
})

/*
  outputStyle:
    nested：嵌套缩进的css代码，它是默认值。

    expanded：没有缩进的、扩展的css代码。

    compact：简洁格式的css代码。

    compressed：压缩后的css代码。

    如需改变压缩格式，可以直接命令行运行： "gulp sass" 来直接编译
*/