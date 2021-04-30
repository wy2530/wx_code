// pages/goods_detail/index.js
import {request } from "../../request/index.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },

  /**
   * 获取商品详情数据
   */
  async getGoodsDetail(goods_id){
    const res=await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",data:{goods_id}});
    this.GoodsInfo=res.data.message;
    this.setData({
      // goodsObj:res.data.message.goods_name
      // 优化，只赋值需要的部分
      goodsObj:{
        goods_name: res.data.message.goods_name,
        goods_price:res.data.message.goods_price,
        // iphone部分手机，不识别webp图片格式
        goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:res.data.message.pics
      }
    })  
  },
  /**
   * 点击轮播图 放大预览 
   */
  handlePrevewImage(e){
    // 1. 构造需要预览的图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 2. 接收传递的url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      urls,
      current
    }); 
  },

  /**
   * 点击加入购物车
   */
  handleCartAdd(){
    // 1. 获取缓存中的购物车数组
    let cart=wx.getStorageSync('cart')||[];
    // 2. 判断商品是否存在与购物车数组
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1)
    {
      //3. 不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //4. 存在，执行num++
      cart[index].num++;
    }
    //5. 重新添加会缓存中
    wx.setStorageSync('cart', cart);
    // 6.弹窗提示
    wx-wx.showToast({
      title: '加入成功',
      icon:"success",
      mask: true
    })
  }
}) 