const gulp = require('gulp');
// 浏览器插件
const browserSync = require('browser-sync');
const reload = browserSync.reload;
// 其它插件
const del = require('del');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require("gulp-babel");
// const combiner = require('stream-combiner2');
// const useref = require('gulp-useref');
const log = log => {
  console.log(`👉👉👉${log}👈👈👈`);
};
// 开发部分
gulp.task('server', async () => {
  log('正在启动服务...');
  await buildScss('./src/scss/*.scss', './src/css/');
  await prefixer('./src/css/*.css', './src/css/');
  await compilerJS('./src/js/es6/*.js', './src/js/es5/');
  browserSync.init({
    server: './src',
    port: 8080, // 设置端口
    ghostMode: false, // 开启的话有一个设备 滚动(scroll)\点击(clicks)\forms 了页面其他设备也会有相同的行为
    notify: false // 不会在浏览器里显示任何提醒(开启的话每次刷新会有提示，在移动端下遮挡很严重)
  });
  gulp.watch('src/scss/*.scss', async () => {
    await buildScss('./src/scss/*.scss', './src/css/');
    await prefixer('./src/css/*.css', './src/css/');
  });
  gulp.watch('src/js/es6/*.js', () => {
    compilerJS('./src/js/es6/*.js', './src/js/es5/');
  });

  gulp.watch([
    'src/*.html',
    'src/page/*.html',
    'src/css/*.css',
    'src/js/es5/*.js',
    'src/img/*'
  ])
      .on('change', reload);
  log('启动服务成功！');
});

// 构建部分
gulp.task('build', async () => {
  log('开始构建：');
  await clearDist();
  await buildScss('./src/scss/*.scss', './dist/css/', 'compressed');
  await prefixer('./dist/css/*.css', './dist/css/');
  await compilerJS('./src/js/es6/*.js', './dist/js/es5/');
  await buildFile();
  log('构建完成');
});

function clearDist () {
  return new Promise(resolve => {
    log('开始清除dist');
    del(['dist'])
      .then(() => {
        log('清除dist完成');
        resolve();
      });
  })
}
function buildScss(readFilePath, writeFilePath, outputStyle = 'expanded') {
  log('开始编译scss, outputStyle: ' + outputStyle);
  return new Promise((resolve) => {
    gulp.src(readFilePath)
        .pipe(sass({
          outputStyle
        }))
        .pipe(gulp.dest(writeFilePath))
        .on('end', () => {
          log('编译scss成功！');
          resolve();
        });
  })
}
function prefixer (readFilePath, writeFilePath) {
  return new Promise((resolve) => {
    log('开始添加css前缀:');
    gulp.src(readFilePath)
        .pipe(autoprefixer({
          browsers: ['last 2 Explorer versions', 'Firefox >= 20', 'last 100 versions'],
          cascade: false
        }))
        .pipe(gulp.dest(writeFilePath))
        .on('end', () => {
          log('添加css前缀完成');
          resolve();
        })
  })
}
function compilerJS (readFilePath, writeFilePath) {
  return new Promise(resolve => {
    log('开始转换js');
    gulp.src(readFilePath)
        .pipe(babel())
        .pipe(gulp.dest(writeFilePath))
        .on('end', () => {
          log('转换js成功');
          resolve();
        })
  })
}
function buildFile () {
  return new Promise(resolve => {
    log('开始写入文件：');
    // 写入index.html
    gulp.src('./src/*.html')
    // .pipe(useref())
        .pipe(gulp.dest('./dist/'));
    // 写入page
    gulp.src('./src/page/*.html')
    // .pipe(useref())
        .pipe(gulp.dest('./dist/page/'));
    // 写入img
    gulp.src('./src/img/*')
        .pipe(gulp.dest('./dist/img/'));
    // 写入js
    gulp.src('./src/js/es5/*.js')
        .pipe(gulp.dest('./dist/js/es5/'))
        .on('end', () => {
          log('写入文件完成！');
          resolve();
        })
  });
}

/*
  outputStyle:
    nested：嵌套缩进的css代码，它是默认值。
    expanded：没有缩进的、扩展的css代码。
    compact：简洁格式的css代码。
    compressed：压缩后的css代码。
*/