#### 一个 Nextjs 学习项目

- 使用 next-auth 库实现 Github、Google 平台授权登录和账号密码登录。
- 支持注册邮箱发送一条激活当前账号的邮件，邮件中有一个链接，用户点击链接可以激活邮箱。
- 中间件实现登录验证，用户没有登录的情况下，访问/user 页面时系统给重定向到登录页面。

.env 案例

```js
# github
AUTH_GITHUB_ID=xxx
AUTH_GITHUB_SECRET=xxxx
AUTH_SECRET=xxx

# google
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx


# DB
DATABASE_URL="mysql://root:root@localhost:3306/next-auth"

# email

MAIL_HOST=smtp.qq.com
MAIL_PORT=465
MAIL_USER=xxxx@qq.com
MAIL_PASS=xxxx
```
