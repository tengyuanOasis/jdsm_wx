// pages/sellerexpress/sellerexpress.js
import {
  tips
} from "../../utils/tips";
import {
  commonDomain as domain
} from "../../constant/common";
import {
  dateTimePicker,
  getMonthDay
} from "../../utils/util";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: domain.domain_qupingce,
    paramData: null,
    userInfo: {}, //用户信息
    orderInfo: null, //上一个页面传递过来的订单信息
    remarkClass: null,
    expressShow: false,
    expresses:['顺丰快递'],
    express_index:0//默认显示顺丰快递
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.paramData = options
    this.initData(options)
  },

  /**
   * 订单跳转到详情页面
   */
  // toOrderDetail: function(e) {
  //   var data = JSON.stringify(e.target.dataset.order);
  //   data = encodeURIComponent(data);
  //   var url = e.target.dataset.url;
  //   wx.navigateTo({
  //     url: url + "?order=" + data,
  //   })
  // },
  initData(paramData) {
    if (paramData.orders == null || paramData.orders == undefined) {
      tips.ERROR_500()
      return
    }
    let orderStr = decodeURIComponent(paramData.orders) //获得单条订单信息
    let phoneNumber = wx.getStorageSync("phoneNumber") //从缓存中获取用户的信息
    if (phoneNumber == null) {
      tips.ERROR_401()
      return;
    } else if (orderStr == null) {
      tips.ERROR_500()
      return;
    }
    this.setData({
      orderInfo: JSON.parse(orderStr)[0]
    })
  },
  //表单提交事件
  formSubmit(e) {
    /**对数据进行校验 */
    let formData = e.detail.value //获取表单里面的数据
    if (formData.companyName == null || formData.companyName == '') {
      tips.ERROR_500000('请选择快递公司')
      return
    }
    if (formData.j_express_number == null || formData.j_express_number == '') {
      tips.ERROR_500000('请填写快递单号')
      return
    }
    if (formData.remark.length > 49) {
      tips.ERROR_500000('备注要求50字内')
      return
    }

    let _this = this;
    //按格式组合多个订单号
    let orderNumbers = _this.data.orderInfo.order_number;
   
    
    let data = {
      orderNumbers: orderNumbers,
      expree_company: formData.companyName,
      express_number: formData.j_express_number,
      order_remark: formData.remark, //50字以内
      token: wx.getStorageSync('token') //身份凭据【必填】
    }

    wx.request({
      url: `${domain.domain_qupingce}/action/order/sendOut`, //提交地址
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
      },
      success(res) {

        if (res.statusCode == '200') { //请求状态码
          if (res.data.status == '200') { //后台返回成功状态码
            wx.showModal({
              title: '发货结果',
              content: res.data.msg,
              showCancel: false,
              success(re) {
                if (re.confirm) {
                  wx.navigateBack({
                    delta:1,
                  })
                }
              }
            });
          } else if (res.data.status == '500') {
            wx.showModal({
              title: '发货失败',
              content: '所选订单均已过期，请重新下单',
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

  },
  copyAddress:function(){
    wx.setClipboardData({
      data: '广东省深圳市福田区福田大厦，尖端数码回收收，18475563915',
      success (res) {
        wx.getClipboardData({
          success (res) {
            //console.log(res.data) // data
          }
        })
      }
    })
  },
  resLogin: function() {
    var that = this;
    wx.showModal({
      title: '登录提示',
      content: "登录已过期或登录失败，是否重新登录？",
      confirmText: "确定",
      cancelText: "取消",
      success: function(res) {
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
  //选择快递公司
  chooseCompany(e) {
    this.setData({
      express_index: e.detail.value
    })
  },
  //备注框聚焦时候的函数
  remarkAddClass() {
    this.setData({
      remarkClass: 'heightlight'
    })
  },
  //备注框失去焦点的时候
  remarkRemoveClass() {
    this.setData({
      remarkClass: null
    })
  },
  /**
   * 订单跳转到详情页面
   */
  toOrderDetail: function (e) {
    
    var data = JSON.stringify(e.target.dataset.order);
    
    data = encodeURIComponent(data);
    wx.navigateTo({
      url: "/pages/mine/orderdetails/orderdetail?order=" + data,
    })
  }
})