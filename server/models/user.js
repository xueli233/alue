const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  'userId': String,
  'userName': String,
  'userPwd': String,
  'orderList': Array,
  'cartList': [
      {
        "productId": String,
        "productName": String,
        "salePrice": String,
        "productNum": Number,
        "productImage": String,
        "productUrl": String,
        "checked": String,
      }
  ],
})

module.exports = mongoose.model('User', userSchema)