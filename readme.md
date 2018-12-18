利用gulp搭建一个可以自动刷新html、scss、js，转换ES6、自动添加css前缀的服务器
============================================

### 1、安装依赖
`
    npm install  or yarn install
`
### 2、启动服务
`
    gulp server
`
### 3、打包项目
`
    gulp build
`

---
**注意：**

    1、建议'src/index.html'为首页，否则服务启动浏览器自动打开时会跳入错误页。
    2、关于样式只建议修改'src/scss'目录中的文件。
    3、关于JS文件建议在'src/js/es6'目录中编写，转换后的文件在'src/js/es5'目录中。
    

