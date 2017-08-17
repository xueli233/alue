var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  // 接收的参数
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }

  // 用户名是否存在
  User.findOne(param, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: '登录失败,用户名或密码错误',
        // result: err
      })
    } else {
      // 种cookie
      res.cookie('userId', doc.userId, {
        path:'/',
        maxAge: 1000*60*60 //1小时过期
      })
      res.cookie('userName', doc.userName, {
        path:'/',
        maxAge: 1000*60*60 //1小时过期
      })
      res.json({
        status: 0,
        msg: '登录成功',
        result: {
          userName: doc.userName
        }
      })
    }
  })
})
// 确认用户是否存在
router.get('/checkLogin', (req, res, next) =>{
  if(req.cookies.userId){
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: '1',
      msg:'未登录',
      result: ''
    })
  }
})
// 退出cookie
router.post('/logout', (req, res, next)=>{
  res.cookie("userId", "",{
    path:'/',
    maxAge: -1
  })
  res.json({
    status:'0',
    msg:'退出成功',
    result:''
  })
})


// 查询购物车列表
router.get("/cartList", (req, res, next) =>{
  let userId = req.cookies.userId
  console.log()
  User.findOne({userId:userId}, (err, doc) => {
    if(err){ // 如果出错
      res.json({
        status: '1',
        msg: '',
        result: err.message
      })
    } else { // 取得数据
      if(doc){
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})
// 编辑商品
router.post('/cartEdit', (req, res, next)=>{
  let userId = req.cookies.userId
  let productId = req.body.productId
  let productNum = req.body.productNum
  let checked = req.body.checked
  // 更新数量
  User.update({"userId":userId,"cartList.productId":productId}, {
    "cartList.$.productNum": productNum, // 商品数量
    "cartList.$.checked": checked, //是否勾选
  }, (err, doc)=>{
    if(err){
      res.json({
        status: '1',
        msg: '商品更新失败',
        result: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '商品更新成功',
        result: doc
      })
    }
  })
})
// 删除商品
router.post("/cartDel", (req, res, next) =>{
  var userId = req.cookies.userId,productId = req.body.productId;
  User.update({"userId":userId},{
    $pull: {
      "cartList":{
        "productId":productId
      }
    }
  }, (err,doc) =>{
    if(err){
      res.json({status:'1',msg:'',result:err.message})
    } else {
      res.json({status:'0',msg:'商品删除成功',result:doc})
    }
  })
})
// 全选的接口
router.post('/editCheckAll', (req, res, next)=>{
  let userId = req.cookies.userId //获取用户id
  checkAll = req.body.checkAll ? '1': '0' // 是否全选
  User.findOne({userId:userId},(err, doc) => {
    if(err){
      res.json({
        status: '1',
        msg: '',
        result:''
      })
    } else {
      doc.cartList.forEach((item)=>{
        item.checked = checkAll
      })
      // 把更改存入数据库
      doc.save((err1,doc1)  => {
        if(err){
          res.json({status:'1',msg:err.message,result:''})
        } else {
          res.json({status:'1',msg:'操作成功',result:''})
        }
      })
    }
  })
})
// // 登录
// router.get('*', (req, res, next) => {
//   res.send('haha')
// })
module.exports = router;
