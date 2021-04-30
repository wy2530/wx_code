// pages/pay/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: { 
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },

  onShow(){
    // 1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    // 1 获取缓存中的购物车数据
    let cart=wx.getStorageSync('cart')||[];
    cart=cart.filter(v=>v.checked)
    this.setData({address});
    

     // 总价格 总数量
     let totalPrice=0;
     let totalNum=0;
     cart.forEach(v=>{     
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
     })

     console.log(cart);
     // 2 给data赋值
     this.setData({
       cart,
       totalPrice,
       totalNum,
       address
     });
  },
})