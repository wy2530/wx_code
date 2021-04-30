/** 请求是同时发送的，但是不能一个关闭加载，其他的也一起关闭加载
 *  所以需要添加异步代码此次数
 */

let ajaxTimes=0;
export const request=(params)=>{
  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: '加载中',
    mask:true  //加蒙版，避免用户其他操作
  });
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes===0){
          wx.hideLoading();
        }
      }
    });
  })
}
