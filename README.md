# Panel for TensorAnalyzor
The website for TensorAnalyzor

## Dependencies
+ [java 17+](https://adoptium.net)
+ [gradle 7+](https://gradle.org)
+ [nodejs 16](https://nodejs.org)
+ [yarn 3+](https://yarnpkg.com)

## Configuration
1.准备`gradle`的属性配置文件`gradle.properties`
```shell
copy gradle-sample.properties gradle.properties
```
2.自行修改gradle.properties中的内容,设置激活的配置项,如`dev`
```shell
# 激活的配置文件
systemProp.spring.profiles.active = dev
```
3.准备激活的编译参数文件
```shell
cd src/main/resources
copy application.yml application-dev.yml
```
4.自行修改`application-dev.yml`中的内容

## Build & Run
```shell
# a)安装前端依赖项
cd src/main/resources/static
yarn
# b)编译java工程
cd ../../../..
gradle
# c)启动
gradle bootRun
# d)开发环境热更新前端资源
cd src/main/resources/static
npm run dev
```