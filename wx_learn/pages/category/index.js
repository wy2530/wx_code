// pages/category/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    // 被点击的左侧的菜单
    currentIndex:0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  //接口返回数据
  Cates:[], 

  onLoad:function(options){
    /**
     * 缓存技术：
     * 1. 先判断一下本地存储中有没有旧的数据
     *  {time:Data.now(),data:[...]}
     * 2. 没有旧数据，就直接发送请求
     * 3. 有旧数据，同时没有过期，即使有本地存储数据
     */
    
    // (1). 获取本地存储数据
    const Cates=wx.getStorageSync('cates');
    // (2). 判断
    if(!Cates){
      // 不存在 发送请求
      this.getCates();
    }else{
      // 存在数据  定义过期时间
      if(Date.now()-Cates.time>1000*1000){
        this.getCates();
      }else{
        //使用旧数据
        this.Cates=Cates.data;
        //重新渲染
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  //获取分类数据
  // getCates(){
  //   request({
  //     url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"})
  //     .then( res=>{
  //       // console.log(res);
  //       this.Cates=res.data.message;

  //       // (3). 把接口数据存入到本地存储
  //       wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})

  //       // 构造左侧菜单数据
  //       let leftMenuList=this.Cates.map(v=>v.cat_name);

  //       let rightContent=this.Cates[0].children;
  //       this.setData({
  //         leftMenuList,
  //         rightContent
  //       })
  //     })

  // },

  async getCates(){
    const res=await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"})
    this.Cates=res.data.message;

    // (3). 把接口数据存入到本地存储
    wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})

    // 构造左侧菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);

    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 左侧菜单的点击事件
  handleItemTap(e){
    // 1. 获取被点击的标题的索引
    const {index} =e.currentTarget.dataset;

    //3.根据不同索引修改右侧内容
    let rightContent=this.Cates[index].children;

    // 2.给data中currentIndex赋值
    this.setData({
      currentIndex:index,
      rightContent,
       // 重新设置 距离顶部的距离
      scrollTop:0
    }) 
  }
})