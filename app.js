//app.js
import {
  commonDomain as domain
} from "/constant/common";
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
       // this.getOppenId(res.code);
        //一打开就将授权码存入缓存，后面在用户中心解密手机号，和登录都需要
        wx.setStorageSync('powerCode', res.code);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取小程序更新机制
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  globalData: {
    userInfo: null
  },
  /**
   * 获取wxId
  */
  getOppenId:function(code){
    wx.request({
      url: `${domain.domain_qupingce}/user/wx/getWxId`, 
      data: {
        code: code
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET", //get为默认方法/POST
      success: function (r) {
        if (r.data.code == 200) {
          wx.setStorageSync("wxId", r.data.wxId);
        } else if(r.data.code == 501){
          wx.showToast({
            title: r.data.msg,
            icon: 'none',
            duration: 2000
        })
        wx.setStorageSync("token", r.data.token);
        }else if(r.data.code == 502){
          wx.showToast({
            title: r.data.msg,
            icon: 'none',
            duration: 2000
        })
        wx.setStorageSync("token", r.data.token);
        }else{
          wx.showToast({
            title: "获取信息失败",
            icon: 'none',
            duration: 2000
        })
        wx.setStorageSync("token", r.data.token);
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
   * 登录
  */
  login: function (getUserinfo){
    //授权时请求登录登录
    let code=wx.getStorageSync("powerCode");
    let phone=wx.getStorageSync("phoneNumber");
    wx.request({
      url: `${domain.domain_qupingce}/user/wx/wxLogin`,
      data: {
        code: code,
        phone:phone,
      },
      header: {
        "Content-Type": "applciation/json",
        "firm": "jd",
      },
      method: "get", //get为默认方法/POST
      success: function (r) {
        if (r.data.code == 200) {
          wx.showToast({
            title: '已登录',
            icon:'none',
          })
          wx.setStorageSync("token", r.data.token);
          //setTimeout(function(){},100);
          if(getUserinfo){
            getUserinfo(r.data.token)
          }
        }else{
          wx.showModal({
            content: r.data.msg,
            confirmText: "确定",
            showCancel: false
          })
        }
        
      },
      fail: function (err) {
      }, //请求失败
      complete: function (r) { } //请求完成后执行的函数
    })

  }
}) 