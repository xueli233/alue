var express = require('express');
var router = express.Router();
const User = require('../models/user');

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
  user.findOne(param, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: '登录失败,用户名或密码错误',
        result: err
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
router.post('logout', (req, res, next)=>{
  res.cookie("userId", "",{
    path:'/',
  })
  res.json({
    status:'0',
    msg:'退出成功',
    result:''
  })
})

// 登录
router.get('*', (req, res, next) => {
  res.send('haha')
})

module.exports = router;