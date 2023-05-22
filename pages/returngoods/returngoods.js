// pages/returngoods/returngoods.js
import {
  commonDomain as domain
} from "../../constant/common";
import {
  tips
} from "../../utils/tips";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasOrder: false,
    domain: domain.domain_qupingce,
    userInfo: null,
    orderInfo: null,
    areaf: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.order == null || options.order == undefined) {
      tips.ERROR_500()
      return
    }
    var order = decodeURIComponent(options.order);
    let userInfo = wx.getStorageSync("userInfo") //从缓存中获取用户的信息

    if (userInfo == null) {
      tips.ERROR_401()
      return;
    } else if (order == null) {
      tips.ERROR_500()
      return;
    }
    this.setData({
      userInfo: userInfo,
      orderInfo: JSON.parse(order),
      hasOrder: true
    })

  },
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
  },
  changefocus(e) { //地址输入框改变焦点事件
    this.setData({
      areaf: true
    })
  },
  /**
   * 订单跳转到详情页面
   */
  toOrderDetail: function(e) {
    var data = JSON.stringify(e.target.dataset.order);
    data = encodeURIComponent(data);
    var url = e.target.dataset.url;
    wx.navigateTo({
      url: url + "?order=" + data,
    })
  },
  bindFormSubmit(e) {
    if (!this.data.hasOrder) {
      wx.showModal({
        title: '',
        content: "暂无订单可退！",
        showCancel: false,
        success(re) {
          if (re.confirm) {
            wx.navigateBack({})
          }
        }
      });
      return;
    }

    var mobilereg = /^1([3589][0-9]|4[579]|66|7[0135678]|9[189])[0-9]{8}$/;
    var sellername = e.detail.value.sellername;
    var phone = e.detail.value.phone;
    var address = e.detail.value.address;

    if (sellername == "") {
      wx.showModal({
        title: '',
        content: "名字长度或格式错误",
        showCancel: false
      });
      return;
    }

    if (phone == "" || !mobilereg.test(phone)) {
      wx.showModal({
        title: '',
        content: "请输入正确的手机号",
        showCancel: false
      });
      return;
    }

    if (address == "") {
      wx.showModal({
        title: '',
        content: "地址不能为空",
        showCancel: false
      });
      return;
    }

    let _this = this;
    let data = {
      order_number: _this.data.orderInfo.order_number,
      is_agree_price: 'False', //用户不同意二次报价
      return_name: sellername, //收件人地址【必填】
      return_phone: phone, //收件人电话【必填】
      return_address: address, //收件人地址【必填】
      token: wx.getStorageSync('token') //身份凭据【必填】
    }

    wx.request({
      url: `${domain.domain_qupingce}/action/order/isAgreeChangePrice`, //提交地址
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.statusCode == '200') { //请求状态码
          if (res.data.status == '200') { //后台返回成功状态码
            wx.showModal({
              title: '',
              content: "退件信息已成功提交！",
              showCancel: false,
              success(re) {
                if (re.confirm) {
                  wx.navigateBack({

                  })
                }
              }
            });
          } else if (res.data.status == '500') {
            wx.showModal({
              title: '',
              content: res.data.msg,
              showCancel: false
            });
          } else if (res.data.status == '501') {
            // wx.showModal({
            //   title: '',
            //   content: "登录已过期",
            //   showCancel: false
            // });
            _this.resLogin();
          } else if (res.data.status == '500000') {
            wx.showModal({
              title: '',
              content: "失败，请稍后再试！",
              showCancel: false
            });

          }
        }
      }
    })

  }

})