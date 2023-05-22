// pages/mine/per/updateinfo/updateinfo.js
var interval = null;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seller_phone:'绑定手机号',
    time: '保存', //倒计时 
    currentTime: 61,
    isHiden:false,
    code:'',
    error:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var seller_phone=options.seller_phone;
    if(seller_phone){
      this.setData({
        seller_phone:seller_phone
      })
    }
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },/***/
  phoneChange:function(e){
    this.setData({
      seller_phone: e.detail.value,
      error:''
    })
  },

  backePage:function(){
    wx.navigateBack({
      delta:1
    })
  },
  save:function(){
    //先获取验证码 后再请求改变
    var that=this;
    var phone=this.data.seller_phone;

    var regPhone = new RegExp('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', 'g');
    if (!regPhone.exec(phone)) {
      wx.showModal({
        title: '错误提示',
        content: "请输入正确的手机号！",
        showCancel: false
      })
      return false;
    }

    //
    //加载动画
    wx.showLoading({
      title: "发送中...",
      mask: true
    })
    wx.request({
      url: 'https://sso.qupingce.com/code/sendcode',
      data: {
        remark: 'setPhone',
        phone: phone
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET", //get为默认方法/POST
      success: function (r) {
        wx.hideLoading();
        
        if (r.data.status == 200) {
          //发送成功不能重复点
          that.getCode();
          that.setData({
            disabled: true
          })
          //成功后 填写验证码
          that.setData({
            isHiden:true
          })

        } else {
          wx.showModal({
            title: '错误提示',
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
  },
  /**
   * 倒计时
  */
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '保存', 
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  /**
   * 验证码改变
  */
  codeChange:function(e){
    this.setData({
      code:e.detail.value,
      error: ''
    })
  },
  /**
   * 取消输入
  */
  cancel:function(){
    this.setData({
      isHiden:false
    })
  },
  /**
   * 确认
  */
  confirm:function(){
    var that=this;
    var phone = this.data.seller_phone;
    var code=this.data.code;
    var wxId=wx.getStorageSync("wxId");

    var regPhone = new RegExp('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', 'g');
    if (!regPhone.exec(phone)) {
      that.setData({
        error:"请输入正确的手机号！"
      })
      return false;
    }

    if (code=='' || !code){
      that.setData({
        error: "请输入验证码！"
      })
      return false;
    }

    if (!wxId) {
      that.setData({
        error: "绑定失败！"
      })
      return false;
    }
    //加载动画
    wx.showLoading({
      title: "绑定中...",
      mask: true
    })
    wx.request({
      url: 'https://sso.qupingce.com/qpc/modPhone',
      data: {
        seller_phone: phone,
        code:code,
        wxId:wxId
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET", //get为默认方法/POST
      success: function (r) {
        wx.hideLoading();
        that.setData({
          code:'',
          isHiden:false
        })
        if (r.data.status == 200) {
          wx.showToast({
            title: '成功！',
            icon: 'success',
            duration: 2000,
            mask: true
          })
          //绑定成功后发起登录请求
          app.login();
          //关闭倒计时
          clearInterval(interval)
          that.setData({
            time: '保存',
            currentTime: 61,
            disabled: false
          })
          //跳转到user
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/mine/user',
            })
          },1000)
        } else {
          wx.showModal({
            title: '错误提示',
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