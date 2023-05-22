// pages/mine/per/per.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //微信用户信息
    userInfo1: null, //初始值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化用户信息
    var userInfo = JSON.parse(options.userInfo);
    var userInfo1 = JSON.parse(options.userInfo1);
    this.setData({
      userInfo: userInfo,
      userInfo1: userInfo1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 去绑定页面
  */
  toBinDing:function(){
    wx.navigateTo({
      url: 'binding/binding',
    })
  }
})