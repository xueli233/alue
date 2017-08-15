const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Goods = require('../models/goods')

// 连接服务器
// 状态打印
mongoose.connect('mongodb://127.0.0.1:27017/shop')
mongoose.connection.on('connected', () => {
  console.log('Mongodb conneted succss')
})
mongoose.connection.on('err', () => {
  console.log('Mongodb connected fail')
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongodb disconnected ')
})
/**
 * 排序,分布
 * 
*/
router.get('/list', (req, res, next) => {
  let sort = parseInt(req.param("sort")); //排序方式
  let page = parseInt(req.param("page")); //第几页
  let pagesize = parseInt(req.param("pagesize")); //每页个数
  let skip = (page - 1) * pagesize //跳过条数
  console.log(page,skip)
  let priceLevel = req.param("priceLevel");
  let priceGt = '',priceLte = '';
  let param = {};

  if(priceLevel != 'all'){
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100;break;
      case '1': priceGt = 100; priceLte = 500;break;
      case '2': priceGt = 500; priceLte = 1000;break;
      case '3': priceGt = 1000; priceLte = 5000;break;
    }
    param = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte,
      }
    }
  }
  //数据库排序
  let goodModel = Goods.find(param).limit(pagesize).skip(skip);
  goodModel.sort({'salePrice':sort})
  goodModel.exec({params:param},function(err, docs){
      res.json({
        status:'0',
        result:docs
      })
  })
})

/**
 * 加入购物车
 * */
router.post('/addCart', (req,res,next) => {
  // var userId = req.body.userId 
  var userId = '100000077';
  var productId = req.body.productId;
  // var productId = '201710013'
  var User = require('../models/user')
  // 通过productId查询出一条商品,然后存入到用户的cartList
  User.findOne({userId:userId},(err,userDoc) => {
    let goodItem = '';
    // console.log(userDoc) //返回用户的所有数据
    // 先去数据库里面查询一下
    userDoc.cartList.forEach((item)=>{
      // 如果存在,刚productNum加1
      // console.log(item) // 返回购物车列表
      if(item.productId == productId){
        goodItem = item //把相同的产品赋值一个变量
        item.productNum++;
      }
    })

    /**
     * 如果商品存在,刚数量++
     * 如果商品不存在,刚从数据库取出,push入购物车列表
     */
    if(goodItem){ //已有商品
      userDoc.save((err3, doc3)=>{
        if(err3){
          res.json({
            status: "1",
            msg: err.message,
            result:doc3
          })
        } else {
          res.json({
            status: "0",
            msg:"商品数量添加成功"
          })
        }
      })
    } else { //第一次添加购物车
      Goods.findOne({ productId: productId },(err1, goodsDoc) => {
        goodsDoc.productNum = 1;
        userDoc.cartList.push(goodsDoc) // 加入
        userDoc.save((err2, doc2) => {
          if(err2) throw err2// 返回数据
          
          res.json({
            status:0,
            msg:'第一次加入购物车',
            result: ''
          })
        })
      })
    }
  })
})

module.exports = router