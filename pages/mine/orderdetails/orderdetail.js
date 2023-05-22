// pages/mine/orderdetails/orderdetail.js
import {
  commonDomain as domain
} from "../../../constant/common";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: domain.domain_qupingce,
    order: {
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化订单数据
    var data = options.order;
    data = decodeURIComponent(data);
    var order=JSON.parse(data);
    console.log(order)
    this.setData({
      order:order
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //完成后关闭刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  toTestReport:function(e){

    wx.navigateTo({
          url: '/pages/testReport/testReport?myorder_id=' + e.target.dataset.myorderid+
          '&imei='+e.target.dataset.imei+'&name='+e.target.dataset.name
    });
  }

})