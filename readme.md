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
    2、关于样式文件只建议在'src/scss'目录中开发，本地服务启动后编译的css文件在'src/css'目录中，打包后在'dist/js'目录中。
    3、关于JS文件只建议在'src/js-es6'目录中开发，本地服务启动后编译的js文件在'src/js'目录中，打包后在'dist/js'目录中。
    4、打包后的文件本地打开没有加载css和js? 请使用'serve'、'anywhere'或类似的工具本地运行，或者修改.html文件引入静态资源的路径为'./'开头。
    

