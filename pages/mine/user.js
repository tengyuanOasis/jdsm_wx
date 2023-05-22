// pages/mine/user.js
import {
  commonDomain as domain
} from "../../constant/common";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: domain.domain_qupingce,
    waitSendCount: 0,
    avatarUrl:"/images/peishi.jpg",
    userInfo: {}, //微信用户信息
    hasUserInfo: false,
    hasPhoneNumber: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo1: null, //初始值
    recentOrders: [], //近期订单
    dataLoad: false, //数据加载
    error: { //弹框消息
      title: "",
      msg: "",
      confirm: '',
      cancel: ''
    },
    error1: { //弹框消息
      title: "",
      msg: "",
      confirm: '',
      cancel: ''
    },
    error3: { //操作错误提示
      title: "",
      msg: "",
      confirm: '',
      cancel: ''
    },
    cancelOrder: null //点击不同意报价订单item
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('phoneNumber'))
    this.setData({
      phoneNumber:wx.getStorageSync('phoneNumber').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    })
    //头像
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }

    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo

          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var token = wx.getStorageSync("token");
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    this.dialogSendOut = this.selectComponent("#dialogSendOut");
    //操作提示
    this.action = this.selectComponent("#action");

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync("token");
    if (!token) {
      this.showModalUser();
    } else {
      //回收用户信息（不需要了）
      // this.app.login(that.getUserData)();
      //近期订单
      this.getRecentOrders();
      //console.log(990)
    }
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
    //下拉刷新重新获取用户信息
    // this.app.login(that.getUserData)();
    //近期订单
    this.getRecentOrders();
    //完成后关闭刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   
  },
  /**
   * 授权
   */
  getUserInfo: function (e) {
    if (e.detail.userInfo) { //允许
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
      })
      var url = e.target.dataset.url;
      if (url) {
        wx.navigateTo({
          url: url,
        })
        this.setData({
          showModalStatus: false
        })
      }

    } else {
      wx.showToast({
        title: "未同意授权",
        image: '/images/icon/500000_error.png',
        duration: 2000,
        mask: true
      })
    }

    //授权的同时并登录
    //app.login(this.getUserData);

  },
  /**
   * 跳转到全部订单页面
   */
  gotoAllOrders: function (e) {
    //未授权无法跳转到个人资料
    if (!this.data.hasUserInfo && this.data.canIUse) {
      wx.showToast({
        title: "未授权",
        image: '/images/icon/500000_error.png',
        duration: 2000,
        mask: true
      })
      return
    } else {
      wx.navigateTo({
        url: 'allorders/allorders',
      })
    }
  },
  /**
   * 订单跳转到详情页面
   */
  toOrderDetail: function (e) {
    var data = JSON.stringify(e.target.dataset.order);
    data = encodeURIComponent(data);
    var url = e.target.dataset.url;
    wx.navigateTo({
      url: url + "?order=" + data,
    })
  },
  /**
   * 跳转到我的优惠卷页面去
   */
  gotoCoupons: function () {
    //未授权无法跳转到个人资料
    if (!this.data.hasUserInfo && this.data.canIUse) {
      wx.showToast({
        title: "未授权",
        image: '/images/icon/500000_error.png',
        duration: 2000,
        mask: true
      })
      return
    } else {
      wx.navigateTo({
        url: 'coupons/coupons',
      })
    }
  },
  /**
   * 条转到个人资料页面
   */
  toUserDetail: function (e) {

    //未授权无法跳转到个人资料
    if (!this.data.hasUserInfo && this.data.canIUse) {
      wx.showToast({
        title: "未授权",
        image: '/images/icon/500000_error.png',
        duration: 2000,
        mask: true
      })
    } else {
      var userInfo = JSON.stringify(e.target.dataset.userinfo);
      var userInfo1 = JSON.stringify(e.target.dataset.userinfo1);
      var url = e.target.dataset.url;
      wx.navigateTo({
        url: url + "?userInfo=" + userInfo + "&userInfo1=" + userInfo1
      })
    }
  },
  /**
   * 获取用户信息
   */
  getUserData: function (token1) {
    var that = this;
    var token;
    if (token1) {
      token = token1;
    } else {
      token = wx.getStorageSync("token");
    }

    if (!token) { //如果没有token就不需要去获取用户信息
      return false;
    }
    wx.request({
      url: `${domain.domain_qupingce}/user/getuserinfo`,
      data: {
        token: token
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET", //get为默认方法/POST
      success: function (r) {
        wx.hideLoading();
        if (r.data.status == 200) {
          wx.setStorageSync("userInfo", r.data.data);
          that.setData({
            userInfo1: r.data.data
          })
        } else {
          //that.resLogin(); //登录过期重新登录
        }

      },
      fail: function (err) {}, //请求失败
      complete: function (r) {} //请求完成后执行的函数
    })
  },
  /**
   * 获取近期订单
   * 
   */
  getRecentOrders: function () {
    var token = wx.getStorageSync("token");
    var that = this;
    that.setData({
      dataLoad: true
    })

    wx.request({
      url: `${domain.domain_qupingce}/view/order/getOrdersByUser`,
      data: {
        token: token,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "firm": "jd",
      },
      dataType: 'json',
      method: "POST", //get为默认方法/POST
      success: function (r) {
        that.setData({
          dataLoad: false
        });

        if (r.data.status == 200) {
          //  console.log(r.data.data)
          //计算待发货的数量,两个及以上就建议一键发货
          let count = 0;
          for (let k in r.data.data) {
            if (r.data.data[k].order_status == 'waitdelivery') {
              count++;
            }
          }
          //只取前5
          r.data.data = r.data.data.slice(0, 5);
          that.setData({
            recentOrders: r.data.data,
            waitSendCount: count,
          })
        } else {
          that.resLogin(); //登录过期重新登录
        }

      },
      fail: function (err) {}, //请求失败
      complete: function (r) {} //请求完成后执行的函数
    })
  },
  /**
   * 未同意二次报价
   */
  notAgreedTo: function (e) {
    var order = JSON.stringify(e.target.dataset.order);
    order = encodeURIComponent(order);
    this.setData({
      error: {
        msg: "您可以选择退回机器或联系客服",
        confirm: '直接退回机器',
        cancel: '联系客服',
        contact: true

      },
      cancelOrder: order
    })
    this.dialog.showDialog();

  },
  /**
   * 寄回机器
   */
  notAgreedToConfirm: function () {
    var order = this.data.cancelOrder;
    wx.navigateTo({
      url: '../../../../returngoods/returngoods?order=' + order
    })
    this.dialog.hideDialog()
  },
  /**
   * 联系客服
   */
  notAgreedToCancel: function () {

    this.dialog.hideDialog()
  },
  /**
   * 发货
   */
  sendOut: function (e) {
    //春节暂停代码start
    var curTime = new Date();
    var startTime = new Date(Date.parse("2022-01-24 00:00:00".replace(/-/g, '/')));
    var endTime = new Date(Date.parse("2022-02-07 15:00:00".replace(/-/g, '/')));

    if (curTime.getTime() >= startTime.getTime() & curTime.getTime() <= endTime.getTime()) {
      wx.showModal({
        title: '放假提醒',
        content: '(2022.01.27~2022.02.07)春节放假，8日正常上班，订单超时不发货将过期，需重新估价下单，请合理安排发货时间）',
        confirmText: 'OK',
        showCancel: false,
        success(res) {
          if (res.confirm) {}
        }
      })
    }
    //春节暂停代码end
    var order = JSON.stringify(e.target.dataset.order);
    order = encodeURIComponent(order);
    this.setData({
      error1: {
        msg: "为降低丢件风险，自行寄出仅限于使用顺丰快递哦～",
        title: '选择发货方式',
        confirm: '顺丰上门取件',
        cancel: '自行寄出'

      },
      cancelOrder: order
    })
    this.dialogSendOut.showDialog();
  },
  /**
   * 自行寄出
   */
  toSend: function () {
    var order = JSON.parse(decodeURIComponent(this.data.cancelOrder));
    //console.log(order.version_name)
    let param = [order];
    param = JSON.stringify(param);
    wx.navigateTo({
      url: '/pages/sellerexpress/sellerexpress?orders=' + encodeURIComponent(param),
    })
    this.dialogSendOut.hideDialog();
  },
  /**
   * 上门取件
   */
  theDoorToTake: function () {
    var order = JSON.parse(decodeURIComponent(this.data.cancelOrder));
    //console.log(order.version_name)
    let param = [order];
    param=JSON.stringify(param);
    wx.navigateTo({
      url: '/pages/onlineexpress/onlineexpress?orders=' + encodeURIComponent(param),
    })
    this.dialogSendOut.hideDialog()
  },
  /**
   * 去发货隐藏
   */
  hideDialogSendOut: function () {
    this.dialogSendOut.hideDialog();
  },
  /**
   * 是否同意报价隐藏
   */
  hideDialog: function () {
    this.dialog.hideDialog();
  },
  /**
   * 删除订单
   */
  delOrder: function (e) {
    var orderNumber = e.target.dataset.ordernumber;
    var token = wx.getStorageSync("token");
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: "您将删除该订单，删除后无法恢复，是否确认此操作？",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: "正在删除",
            mask: true
          })
          wx.request({
            url: `${domain.domain_qupingce}/action/order/delOrder`,
            data: {
              token: token,
              orderNumber: orderNumber
            },
            header: {
              "Content-Type": "applciation/json"
            },
            method: "GET", //get为默认方法/POST
            success: function (r) {
              wx.hideLoading();
              if (r.data.status == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon:'none',
                })

                that.getRecentOrders();

              } else if (r.data.status == 501) {
                that.resLogin();
              } else {
                wx.showToast({
                  title: r.data.msg,
                  icon:'none',
                })
              }

            },
            fail: function (err) {}, //请求失败
            complete: function (r) {} //请求完成后执行的函数
          })
        }
      }
    })
  },
  /**
   * 取消订单
   * */
  cancelOrder: function (e) {
    var orderNumber = e.target.dataset.ordernumber;
    var token = wx.getStorageSync("token");
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: "您将取消该订单，取消后无法恢复，是否确认此操作？",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: "正在取消",
            mask: true
          })
          wx.request({
            url: `${domain.domain_qupingce}/action/order/cancelingTheOrder`,
            data: {
              token: token,
              orderNumber: orderNumber
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            dataType: 'json',
            method: "POST", //get为默认方法/POST
            success: function (r) {
              wx.hideLoading();
              if (r.data.status == 200) {
                wx.showToast({
                  title: '取消成功',
                  icon:'none',
                })

                that.getRecentOrders();

              } else if (r.data.status == 501) {
                that.resLogin();
              } else {
                wx.showToast({
                  title: r.data.msg,
                  icon:'none',
                })
              }

            },
            fail: function (err) {}, //请求失败
            complete: function (r) {} //请求完成后执行的函数
          })
        }
      }
    })


  },
  /**
   * 同意报价
   * */
  yesAgreedTo: function (e) {
    var orderNumber = e.target.dataset.ordernumber;
    var token = wx.getStorageSync("token");
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: "您将同意该订单二次报价，是否确认此操作？",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: "操作中",
            mask: true
          })
          wx.request({
            url: `${domain.domain_qupingce}/action/order/isAgreeChangePrice`,
            data: {
              token: token,
              order_number: orderNumber,
              is_agree_price: 'True'
            },
            header: {
              "Content-Type": "applciation/json"
            },
            method: "get", //get为默认方法/POST
            success: function (r) {
              wx.hideLoading();
              if (r.data.status == 200) {
                wx.showToast({
                  title: '操作成功',
                  icon:'none',
                })

                that.getRecentOrders();

              } else if (r.data.status == 501) {
                that.resLogin();
              } else {
                wx.showToast({
                  title: r.data.msg,
                  icon:'none',
                })
              }

            },
            fail: function (err) {}, //请求失败
            complete: function (r) {} //请求完成后执行的函数
          })
        }
      }
    })
  },
  /**
   * 501错误重新登录
   */
  resLogin: function () {
    let self = this;
    wx.showModal({
      title: '登录提示',
      content: "登录已过期或登录失败，请重新登录（需先授权）",
      confirmText: "立即登录",
      cancelText: "关闭提示",
      showCancel: true,
      success(res) {
        // console.log('111')
        if (res.confirm) {
          // console.log('222')
          wx.showLoading({
            title: "登录中...",
            mask: true
          })
          //app.login(that.getUserData); //点击确认就重新登录
          app.login();
          setTimeout(() => {
            self.getRecentOrders();
          }, 2000)
          wx.hideLoading();
        }
      }
    })
  },
  showModalUser: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModalUser: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 解密手机号
   */
  getPhoneNumber(e) {
    let self = this;
    console.log(e)
    if (e.detail.iv) { //用户点了允许授权
      /*  console.log(e.detail.errMsg)
       console.log(e.detail.iv)
       console.log(e.detail.encryptedData) */
      wx.request({
        url: `${domain.domain_qupingce}/user/wx/getPhoneNumber`,
        data: {
          code: wx.getStorageSync('powerCode'),
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        header: {
          "Content-Type": "applciation/json",
          "firm": "jd",
        },
        method: "get", //get为默认方法/POST
        success: function (r) {
          wx.hideLoading();
          if (r.data.code == 200) {
            //console.log(r.data);
            wx.setStorageSync('phoneNumber', r.data.token.phoneNumber);
            self.setData({
              hasPhoneNumber: true,
            })
            self.nowLogin();
          } else {
            // self.setData({
            //   error3: { //操作错误提示
            //     title: "操作提示",
            //     msg: r.data.msg,
            //     confirm: '',
            //     cancel: ''
            //   }
            // })
            // self.action.autoHideDialog();
          }

        },
        fail: function (err) {}, //请求失败
        complete: function (r) {} //请求完成后执行的函数
      })
      //this.nowLogin();
    } else {
      wx.showToast({
        title: "需授权后使用",
        image: '/images/icon/500000_error.png',
        duration: 2000,
        mask: true
      })
    }
  },
  /**
   * 直接登录
   */
  nowLogin: function (e) {
    /* this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }) */
    wx.showLoading({
      title: "登录中...",
      mask: true
    })
    //app.login(this.app.login(that.getUserData));
    //不必强制获取用户头像了
    app.login();
    wx.hideLoading();

    var that = this;
    setTimeout(function () {
      var token = wx.getStorageSync('token');
      if (token) {

        that.hideModalUser();
        //近期订单
        that.getRecentOrders();
      }

    }, 2000)


  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  }
})