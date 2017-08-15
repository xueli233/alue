## vue+mongodb 商城项目

### src文件系统

- assets
  - css
    - base.css
    - checkout.css
    - login.css
    - product.css
- components
  - Footer.vue
  - Header.vue
  - NavBread.vue //面包屑
- router 
  - index.js
- view
  - GoodsList.vue
- App.vue
- main.js

### 配置

- router/index.js
  - 引入GoodsList组件
- App.vue
- main.js
  - vue-lazyload引入懒加载组件,图片未刷新时,会先显示
  - 引入css文件
- static
  - css 
  - img
  - loading

### 模拟后台数据

  - easy mock http://easy-mock.com
- build/dev-server.js
```
var app = express()
var compiler = webpack(webpackConfig)
var router = express.Router();
var goodsData = require('../mock/goods.json');
```
- 给前端提供一个get方式的 api，然后前端就可以通过localhost:8080/goods 访问了
```
router.get("/goods",function(req,res,next){
当前端请求这个api的时候，给他响应，回馈点东西
就把上面的goodsData 按照json的方式发送出去
res.json(goodsData);
});
app.use(router);
```
- 用npm i axios -D语句安装axios并引入。
```
import axios from 'axios'
```

### 服务端

- 1.express生成工具安装
```
npm i -g express-generator
```
- 2. 生成项目
```
express server
```
- 3.安装依赖
```
cnpm i 
```
- 4.启动服务器
```
cd server
node ./bin/www | npm start
```

### mongodb 数据库

- 可视化工具 `mongobooster`
- server/models/goods.js
  - 创建模型,导出
- server/router/goods.js
  - 连接数据库
  - 打印信息
  - 设置`/list`接口
- server/app.js
  - 引入router/goods.js
  - 使用模块`app.use('/goods',goods)
- 问题1:`'mongodb://127.0.0.1:27017/shop'`后面要接表名
- mongodb语法: {$gte:大于等于,$lte:小于等于}
- mongodb排序算法:`db.COLLECTION_NAME.find().sort({KEY:1})`,参数:`1 | -1`
- `limit`,读取指定数量,`skip`路过记录条数
```
>db.COLLECTION_NAME.find().limit(NUMBER).skip(NUMBER)
```

### API

- localhost:8080/goods/list?sort=1&priceLevel=all //后端商品接口

### 功能

- 价格大小排序,区间排序
  - 1.价格区间数据绑定
    - `priceFilter[]`,
    - 点击时添加`class='cur'`class="{cur:true}"
  - 2.大小排序(参数上面数据库排序)
    - 接收参数`req.param("sort")`,`priceLevel`;
    - 设置价格区间`switch(priceLevel) case(0) priceGt=0;priceLte = 100` 
    - 取得`goodModel` 
    - `goodModel`字典排序`sort({价格:sort})`
    - 返回数据
- 分页
  - 业务: 打开页面,先加载可视区东西,好处:减少流量,防止卡顿
    - 前台:当用户鼠标滚动到可视区下面的时候,自动请求后面api,数据追加起来
    - 后端:`goods/list?page=1&pagesize=8`
  - 1.滚动加载数据,`vue-infinite-scroll`
    - `https://github.com/ElemeFE/vue-infinite-scroll`网址
```
- 登录
  - 后端:
    - 参数:`userName`,`userPwd`,查询数据库,是否存在
  - 点击登录按钮,让登录框和遮罩层展示出来
  - 动态控制登录框
  - 前后分离状态下,前端刷新,用户还存在
    - 当登录以后在后端种下cookie,
    - 每次刷新的时候,检测是否存在
```

npm install vue-infinite-scroll --save //安装
// 全局使用 main.js
var infiniteScroll =  require('vue-infinite-scroll');
Vue.use(infiniteScroll)
// 用法 页面追加
<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
  ...
</div>
// loadMore 方法,函数节流
loadMore: function() {
      this.busy = true;

      setTimeout(() => {
        // 在这里写函数
        this.busy = false;
      }, 1000);
    }
```

- 加入购物车
  - 谁点击加入谁
  - 参数:`userId`,`productId`
 - 后端:
  - user模型 `userId`
  - router/goods.js
- 购物车
  - router/index.js内引入组件
  - 添加path
  - 跳转<router-link to="/users/cartList">

### 解决问题

- stackoverflow
- segmentfault
- 8080,数据库3000商品跨域
  - config/index.js设置`proxy`代理
- node修改完重启
  - npm install supervisor -g;
  - supervisor app.js
- 电脑突然变得非常卡,`supervisor`占据非常大的资源
- 访问`http://localhost:8080/goods/list`时出错,必须要传参

### 小知识

- spa (single page aplication) 对seo,sem搜索引擎营销
> 目的是为了解决单页面应用的 SEO 的问题，对于一般网站影响不大，但是对于论坛类，内容类网站来说是致命的，搜索引擎无法抓取页面相关内容，也就是用户搜不到此网站的相关信息
- ssr (server side render)服务端渲染
- vue有个ssr,nuxt.js
- cookie客户端,session
  - session一定时间内保存在服务器上
  - 登录信息存放在session
  
### 规划

- 购物车，增加，删除，提交,登录,登录拦截，注销,全局 组件
- 服务号
- 毕业 熟悉业务代码
- koa2 express4
- sftp 本地修改服务器代码

