// pages/mine/per/binding/binding.js
var interval = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '获取验证码', //倒计时 
    currentTime: 61,
    phone:'',
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 手机号改变
   * */
  phoneChange:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  codeChange:function(e){
    this.setData({
      code: e.detail.value
    })
  }
   ,
  /**
   * 倒计时
  */
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  /**
   * 获取验证码
  */
  getVerificationCode() {
   
    var that = this;
    var phone=this.data.phone;
    var regPhone = new RegExp('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', 'g');
    if (!regPhone.exec(phone)){
      wx.showModal({
        title: '错误提示',
        content: "请输入正确的手机号！",
        showCancel: false
      })
      return false;
    }
    
    //加载动画
    wx.showLoading({
      title: "发送中...",
      mask: true
    })
    wx.request({
      url: 'https://sso.qupingce.com/code/sendcode',
      data: {
        remark:'wxBinding',
        phone:phone
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET", //get为默认方法/POST
      success: function (r) {
        if (r.data.status == 200) {
          //发送成功后60秒后再试
          that.getCode();
          that.setData({
            disabled: true
          })
          wx.showToast({
            title: "发送成功",
            icon: 'success',
            duration: 2000,
            mask: true
          })
        } else {
          wx.showToast({
            title: "发送失败！",
            image: '/images/icon/500_error.png',
            duration: 2000,
            mask: true
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "暂无网络！",
          image: '/images/icon/500_error.png',
          duration: 2000,
          mask: true
        })
      }, //请求失败
      complete: function (r) { } //请求完成后执行的函数
    })

  },
  /**
   * 绑定
  */
  binding:function(){
    var that=this;
    var phone=this.data.phone;
    var code=this.data.code;
    var wxId=wx.getStorageSync("wxId");

    var regPhone = new RegExp('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', 'g');
    if (!regPhone.exec(phone)) {
      wx.showModal({
        title: '提示',
        content: "请输入正确的手机号！",
        showCancel: false
      })
      return false;
    }
    if(code==''){
      wx.showModal({
        title: '提示',
        content: "请输入验证码！",
        showCancel: false
      })
      return false;
    }
    if (!wxId) {
      wx.showModal({
        title: '提示',
        content: "未获取到微信用户信息！",
        showCancel: false
      })
      return false;
    }
    //加载动画
    wx.showLoading({
      title: "绑定中...",
      mask: true
    })
    wx.request({
      url: 'https://sso.qupingce.com/qpc/wxBinding',
      data: {
        seller_phone: phone,
        code: code,
        tu:'wx',
        wxId:wxId
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET", //get为默认方法/POST
      success: function (r) {
        wx.hideLoading();
        if (r.data.code == 200) {
          wx.setStorageSync("token", r.data.token);
          wx.showToast({
            title: "绑定成功",
            icon: 'success',
            duration: 2000,
            mask: true,
            complete:function(){
              wx.switchTab({
                url: '/pages/mine/user',
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: r.data.msg,
            showCancel: false
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "暂无网络！",
          image: '/images/icon/500_error.png',
          duration: 2000,
          mask: true
        })
      }, //请求失败
      complete: function (r) { } //请求完成后执行的函数
    })
  }
})