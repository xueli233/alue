<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>商品</nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">{{ priceSort }}
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur':priceChecked == 'all'}">All</a>
              </dd>
  
              <!-- price selected -->
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index,price)" :class="{'cur':priceChecked == index}">
                  {{price.startPrice}} - {{price.endPrice}}
                </a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in GoodsList ">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'/static/img/' + item.productImage" alt="">
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" @click="addCart(item.productId)" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
                  ...
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
    <!-- 加入购物车提示框 -->
    <Modal :mdShow='mdShow'>
      <p slot="message">请先登录否则无法加入购物车</p>
      <div slot="btnGroup">
        <a href="javascript:" class="btn-login" @click="mdShow=false">关闭</a>
      </div>
    </Modal>
    <!-- 登录成功的情况下 -->
    <modal :mdShow="addShow">
      <p slot="message">加入购物车成功</p>
      <div slot="btnGroup">
        <a href="javascript:" class="btn btn--m" @click="addShow=false" >继续购物</a>
        <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
      </div>
    </modal>
  </div>
</template>
<script>
import NavHeader from '@/components/Header'
import NavFooter from '@/components/Footer'
import NavBread from '@/components/NavBread'
import Modal from '@/components/Modal'
import axios from 'axios'
export default {
  name: 'GoodsList',
  data() {
    return {
      GoodsList: Array,
      priceChecked: 'all',
      priceSort: 'Price ↓',
      sortFlag: true,
      busy: true,
      mdShow: false,
      addShow: false,
      page: 1,
      pagesize: 8,
      priceFilter: [
        { startPrice: '0.00', endPrice: '100.00' },
        { startPrice: '100.00', endPrice: '500.00' },
        { startPrice: '500.00', endPrice: '1000.00' },
        { startPrice: '1000.00', endPrice: '5000.00' },
      ]
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal,
  },
  mounted: function () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList(flag) {
      let param = {
        sort: this.sortFlag ? 1 : -1, // 排序方式
        priceLevel: this.priceChecked,
        page: this.page,
        pagesize: this.pagesize
      }
      
      axios.get('/goods/list', { params: param }).then((result) => {
        let res = result.data
        if(res.status === '0'){ //请求成功

          if(flag){
            this.GoodsList = this.GoodsList.concat(res.result) //连接数据
            if(res.result.length === 0){
              this.busy = true //停止
            } else {
              this.busy = false  //滚动刷新
            }
          } else {
            this.GoodsList = res.result;
            this.busy = false //滚动刷新
          }
        } else { //请求错误
          //系统正忙
        } 
      })
    },
    sortGoods() { //商品排序,从大到小,或者从小到大
      this.sortFlag = !this.sortFlag
      if(this.sortFlag) this.priceSort = 'Price ↓'
      else this.priceSort = 'Price ↑'
      this.page = 1
      this.getGoodsList()
    },
    setPriceFilter(index) { //切换class名
      this.page = 1
      this.priceChecked = index //把选中设置为当前的index
      this.getGoodsList() //更新商品
    },
    loadMore () { 
      this.busy = true // 节流
      setTimeout( () => {
        this.page++
        this.getGoodsList(true) //true需要数据接
      }, 1000);
    },
    addCart (productId) {
      // console.log(productId)
      axios({
        method: 'post',
        url: '/goods/addcart',
        data: {
          productId: productId,
        }
      }).then((response) => {
        let res = response.data
        // console.log(res)
        if(res.status == 1){
          this.mdShow = true
        } else {
          this.addShow = true
        }
      })
    }
  }
}
</script>