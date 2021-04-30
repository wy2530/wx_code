// pages/cart/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: { 
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },

  onLoad:function(options){
    // 1.获取缓存中的收货地址
    const address=wx.getStorageSync('address');
    console.log(address);
    // 2. 给data赋值
    this.setData({
      address:address
    })
  },
  onShow(){
    // 1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    // 1 获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
    // 计算全选
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({address});
    this.setCart(cart);

  },
  // 1.点击收货地址
  handleChooseAddress(){
    // 2. 调用内部api 获取用户收获地址
    wx.chooseAddress({
      success: (address) => {
        // 将结果放入缓存
        
        wx.setStorageSync('address', address)
      },
     fail: (error) => {
        //
      }
    })
  },
  // 商品的选中
  handleItemChange(e){
    // 1.获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id;
    // 2.获取购物车数组
    let {cart}=this.data;
    // 3.找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 4. 选中状态反选
    cart[index].checked=!cart[index].checked;
    
    this.setCart(cart);



  },

  // 设置购物车状态，重新计算
  setCart(cart){
  
    let allChecked=true;
    // 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    // 判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    // 2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.getStorageSync('cart',cart);
  },

  // 商品全选
  handleItemAllCheck(){
    //获取data中的数据
    let {cart,allChecked}=this.data;
    //修改值
    allChecked=!allChecked;
    //循环修改cart数组中商品选择状态
    cart.forEach(v=>v.checked=allChecked);
    //修改后的值填充为data或缓存
    this.setCart(cart);
  },

  //商品数据的编辑功能
  handleItemNumEdit(e){
    //获取传递的参数
    const {operation,id}=e.currentTarget.dataset;
    // console.log(operation,id);
    // 获取购物车数据
    let {cart}=this.data;
    // 找到需要修改的商品索引
    const index=cart.findIndex(v=>v.goods_id===id);

    

    //判断数量
    if(cart[index].num===1&&operation===-1){
      wx.showModal({
        content: '你是否要删除?',
        title: '提示',
        success: (result) => {
          if(result.confirm){
            cart.splice(index,1);
            this.setCart(cart);
          }else if(result.cancel){
            //
          }
        },
      })
    } else{
      // 进行修改数量
      cart[index].num+=operation;         
      // 设置回缓存和data中
      this.setCart(cart);
    }
  },

  //结算功能
  handlePay(){
    const {address,totalNum}=this.data;
    //判断购物车是否为空
    if(totalNum===0){
      wx.showToast({
        title: '购物车为空',
        icon:'none', 
        mask:true 
      })
      return;
    }

    //判断收获地址
    if(!address.userName){
      wx.showToast({
        title: '请选择收货地址',
        icon:'none', 
        mask:true 
      })
      return;
    }

    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})