// pages/mine/allorders/allorders.js
const app = getApp();
import {
  commonDomain as domain
} from "../../../constant/common";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: domain.domain_qupingce,
    waitSendCount: 0,
    allOrders: [],
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
    cancelOrder: null //临时存放订单数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //近期订单
    this.getAllOrders();
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
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    this.dialogSendOut = this.selectComponent("#dialogSendOut");
    //操作提示
    this.action = this.selectComponent("#action");
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
    this.getAllOrders();
    //完成后关闭刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
   * 获取近期订单
   * 
   */
  getAllOrders: function () {
    var token = wx.getStorageSync("token");
    var that = this;
    that.setData({
      dataLoad: true
    })

    wx.request({
      url: `${domain.domain_qupingce}/view/order/getOrdersByUser`,
      data: {
        token: token
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: 'json',
      method: "POST", //get为默认方法/POST
      success: function (r) {

        if (r.data.status == 200) {
          //计算待发货的数量,两个及以上就建议一键发货
          let count = 0;
          for (let k in r.data.data) {
            if (r.data.data[k].order_status == 'waitdelivery') {
              count++;
            }
          }
          that.setData({
            dataLoad: false,
            waitSendCount: count,
            allOrders: r.data.data,
          })

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
      url: '/pages/returngoods/returngoods?order=' + order
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
   * 是否同意报价隐藏
   */
  hideDialog: function () {
    this.dialog.hideDialog();
  },
  /**
   * 发货
   */
  sendOut: function (e) {
    var order = JSON.stringify(e.target.dataset.order);
    order = encodeURIComponent(order);
    this.setData({
      error1: {
        msg: "为降低丢件风险，自行寄出仅限于顺丰快递噢~",
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
    console.log(order.version_name)
    let param = [{
      number: order.order_number,
      name: order.version_name,
      price: order.secondary_recycle == 0 ? (order.recycle_money) : (order.secondary_recycle),
    }];
    param = JSON.stringify(param);
    wx.navigateTo({
      url: '/pages/sellerexpress/sellerexpress?orders=' + param,
    })
    this.dialogSendOut.hideDialog();
  },
  /**
   * 上门取件
   */
  theDoorToTake: function () {
    var order = JSON.parse(decodeURIComponent(this.data.cancelOrder));
    //console.log(order.version_name)
    let param = [{
      seller_time: order.seller_time,
      number: order.order_number,
      name: order.version_name,
      price: order.secondary_recycle == 0 ? (order.recycle_money) : (order.secondary_recycle),
    }];
    param = JSON.stringify(param);
    wx.navigateTo({
      url: '/pages/onlineexpress/onlineexpress?orders=' + param,
    });
    this.dialogSendOut.hideDialog();
  },
  /**
   * 去发货隐藏
   */
  hideDialogSendOut: function () {
    this.dialogSendOut.hideDialog();
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
                that.setData({
                  error3: { //操作错误提示
                    title: "操作提示",
                    msg: "订单删除成功！",
                    confirm: '',
                    cancel: ''
                  }
                })
                that.action.autoHideDialog();

                that.getAllOrders();

              } else if (r.data.status == 501) {
                that.resLogin();
              } else {
                that.setData({
                  error3: { //操作错误提示
                    title: "操作提示",
                    msg: r.data.msg,
                    confirm: '',
                    cancel: ''
                  }
                })
                that.action.autoHideDialog();
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
                that.setData({
                  error3: { //操作错误提示
                    title: "操作提示",
                    msg: "订单取消成功！",
                    confirm: '',
                    cancel: ''
                  }
                })
                that.action.autoHideDialog();

                that.getAllOrders();

              } else if (r.data.status == 501) {
                that.resLogin();
              } else {
                that.setData({
                  error3: { //操作错误提示
                    title: "操作提示",
                    msg: r.data.msg,
                    confirm: '',
                    cancel: ''
                  }
                })
                that.action.autoHideDialog();
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
                that.setData({
                  error3: { //操作错误提示
                    title: "操作提示",
                    msg: "操作成功！",
                    confirm: '',
                    cancel: ''
                  }
                })
                that.action.autoHideDialog();

                that.getAllOrders();

              } else if (r.data.status == 501) {
                that.resLogin();
              } else {
                that.setData({
                  error3: { //操作错误提示
                    title: "操作提示",
                    msg: r.data.msg,
                    confirm: '',
                    cancel: ''
                  }
                })
                that.action.autoHideDialog();
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
    var that = this;
    wx.showModal({
      title: '登录提示',
      content: "登录已过期或登录失败，是否重新登录？",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: "登录中...",
            mask: true
          })
          app.login(); //点击确认就重新登录
          wx.hideLoading();
        }
      }
    })
  }
})