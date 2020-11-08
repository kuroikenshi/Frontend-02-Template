学习笔记

# 线上发布系统

## apt install n
用来管理node_js的版本

## express
服务器框架

# 使用github提供的认证系统

## 创建app
在登录后，user -> setting -> developer setting -> new github app

### 使用client_id和secret
1. 使用`https://github.com/login/oauth/authorize?client_id=${client_id}`进行认证  
  获得返回`code`  

2. 使用`https://github.com/login/oauth/access_token`去用`code`换取`token`  

3. 带上`token`作为http请求头，即可访问github的user信息



