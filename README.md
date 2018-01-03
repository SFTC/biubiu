# BiuBiu

脚手架工具

## 安装

```bash
npm i -g biubiu
```

## 使用

```bash
cd <projectRoot>
biubiu -m moduleName
biubiu -p pageName
```

## 配置

支持简易配置，在模块根目录放置biubiu.conf.js，内容如lib/init.conf.js；

## todo

1. 文件目录调整，支持将A模块下的a页面迁移到B模块下；
2. 当前使用handlebars模板，与vue的模板语法冲突，更换一个；
