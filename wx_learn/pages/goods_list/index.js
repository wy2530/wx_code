// pages/goods_list/index.js
/**
 * 添加上滑页面，滚动条触底 加载下一页的效果
 * 1. 找到触底事件  onReachBottom
 * 2. 判断是否存在下一页
 * 3. 若没有下一页，弹出提示
 * 
 */
import {request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabs:[
        {
          id:0,
          value:"综合",
          isActive:true
        },
        {
          id:1,
          value:"销量",
          isActive:false
        },
        {
          id:2,
          value:"价格",
          isActive:false
        }
      ],
     goodsList:[]
  },

  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid;
    this.getGoodsList();
  },
  // 获取商品列表数据
  async getGoodsList(){
   const res=await request({url:'https://api-hmugo-web.itheima.net/api/public/v1/goods/search',data: this.QueryParams});
   //获取总条数
   const total=res.data.message.total;
   //  计算总页数
   this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
  //  console.log(this.totalPages)
   this.setData({
    //  拼接数组
    goodsList:[...this.data.goodsList,...res.data.message.goods]
   })
  //  console.log(res.data.message.goods);
  // 关闭刷新效果
   wx.stopPullDownRefresh();
  },


  handleTabsItemsChange(e){
    const {index}=e.detail;
    // 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({tabs})
  },




  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log("到底了")
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '已经到底了~',
      })
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 生命周期：下拉刷新事件
   */
  onPullDownRefresh(){
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum=1;
    // 发送请求
    this.getGoodsList();
    // 请求回来之后，手动关闭刷新效果
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})