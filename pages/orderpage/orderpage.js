// pages/placeorderpage/placeorderpage.js
const app = getApp();
import {
  tips
} from '../../utils/tips'
import {
  commonDomain as domain
} from "../../constant/common"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,//是否显示
    other_money: 0, //初始加价活动
    phoneNumber: '', //手机号
    scrollTop: 0, //滚动条高度
    isDigital: false, //是否来源于智能数码估价
    showModal: false, //控制弹出层
    orderNumber: null, //下单成功返回的订单号
    token: '',
    wxId: null,
    versionId: null,
    btnColor: '#fff', //短信按钮颜色
    ifPress: false, //是否允许短信按钮点击
    tiktok: 45, //获取验证码的间隔，秒
    btntext: '获取验证码', //短信按钮文字
    codeValue: null,
    array: ['自己购买', '活动获得', '他人赠送'],
    index: '0', //机器来源默认选中第一个
   
    show1: true, //show1,show2控制两个方式的显示
    show2: false,
    product_title: '', //机器基本信息
    final_price: 0, //报价
    old_final_price: 0,
    isNew: false, //是否全新机
    product_details: [], //选中详情
    isAgree: false //是否同意协议
  },
  //弹出下拉选择事件
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.isDigital)
    //取出上个页面缓存的数据
    let _this = this;
    wx.getStorage({
      key: 'phoneNumber',
      success(res) {
        _this.setData({
          phoneNumber: res.data,
          codeValue: res.data,
        })
      }
    })
    wx.getStorage({
      key: 'is_new',
      success(res) {
        _this.setData({
          isNew: res.data
        })
      }
    })
    wx.getStorage({
      key: 'product_title',
      success(res) {
        console.log(res.data)
        _this.setData({
          product_title: res.data
        })
      }
    })
    wx.getStorage({
      key: 'wxId',
      success(res) {
        _this.setData({
          wxId: res.data
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success(res) {
        _this.setData({
          token: res.data
        })
      }
    })
    wx.getStorage({
      key: 'versionId',
      success(res) {
        _this.setData({
          versionId: res.data
        })
      }
    })
    wx.getStorage({
      key: 'Arry_name',
      success(res) {
        _this.setData({
          product_details: res.data
        })
      }
    })
    wx.getStorage({
      key: 'final_price',
      success(res) {
        _this.setData({
          final_price: res.data
        })
      }
    })
    wx.getStorage({
      key: 'old_final_price',
      success(res) {
        _this.setData({
          old_final_price: res.data
        })
      }
    })
    wx.getStorage({
      key: 'isDigital',
      success(res) {
        _this.setData({
          isDigital: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.mapCtx = wx.createMapContext('myMap')//地图
  },
  onShow: function () {
    wx.showModal({
      title: "重要提示",
      content: "全新机下单后请在24小时内发货（之前订单不受影响），非全新机请在72小时内发货，超出发货时效的订单需重新下单估价，相关服务条款已更新，详见本页面下方《服务条款》，点击下单即代表您已阅读并同意服务条款内的全部内容，感谢您的支持！",
      showCancel: false,
      confirmText: "我已知晓",
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  //切换显示
  changeShow1: function () {
    this.setData({
      show1: false,
      show2: true
    })
  },
  changeShow2: function () {
    this.setData({
      show2: false,
      show1: true
    })
  },
  //点击常见问题
  seeQuestions: function () {
    wx.navigateTo({
      url: "../questionguide/questionguide"
    })
  },
  //单独获取手机号的输入值
  listenCodeInput: function (e) {
    // console.log(e)
    let _this = this;
    _this.setData({
      codeValue: e.detail.value
    })
  },
  getCheckCode: function () {
    // 发送验证码参数
    var send_code_params = {
      phone: '',
      remark: 'placeOrder'
    };
    let if_pass;
    let mobile = /^1([35789][0-9]|4[579]|66|7[0135678]|9[189])[0-9]{8}$/;
    let param_phone = this.data.codeValue;
    param_phone = param_phone.replace(/\s+/g, "");
    if_pass = mobile.test(param_phone);
    if (if_pass) {
      send_code_params.phone = param_phone;
      // 发送验证码
      this.sendCodeFun(send_code_params);
    } else {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: 'none',
        duration: 2000,
        mask: false
      })
    }
  },
  //限制45s验证码获取间隔
  // 15084422039
  times: function () {
    let _this = this;
    let t;
    this.data.tiktok--;
    // console.log('禁止');
    //禁止点击的效果
    this.setData({
      btntext: this.data.tiktok + '秒后再试',
      ifPress: true,
      btnColor: '#ffd22b',
    })
    //console.log(this.data.tiktok)
    t = setTimeout(function () {
      _this.times();
    }, 1000);
    if (this.data.tiktok <= 0) {
      // 计时重置为45秒
      this.data.tiktok = 45;
      clearTimeout(t);
      //恢复点击的效果
      this.setData({
        btntext: '再次获取',
        ifPress: false,
        btnColor: '#B55946',
      })
    }
  },
  sendCodeFun: function (send_code_params) {
    let that=this;
    wx.request({
      url: `${domain.domain_qupingce}/common/sendCode`,
      method: 'get',
      header: {
        "firm": "jd",
      },
      data: send_code_params,
      dataType: 'json',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.status === 200) {
            that.setData({
              isShow:true
            })
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000,
              mask: false
            });
            //发送成功才禁止点击
            this.times();
          } else {
            //  console.log(res.data.msg)
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              mask: false
            })
          }
        }

      }
    })
  },
  //点击下单按钮，先表单验证，再下单
  formSubmit: function (e) {
    console.log("下单下单1")
    // console.log(this.data.product_title);
    // wx.getStorageInfo({
    //   success(res) {
    //     console.log(res)
    //   }
    // })
    //正则
    let mobile = /^1([35789][0-9]|4[579]|66|7[0135678]|9[189])[0-9]{8}$/;
    let check_name = /^[\u4E00-\u9FA5]+$/; //中文正则
    let check_mail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //邮箱
    //let check_bank = /^([1-9]{1})(\d{15}|\d{18})$/;//银行卡号验证
    let check_bank = /^\d{16,19}$/;
    //订单参数
    var order_params = {
      collect_money_account: e.detail.value.dealAccount, //收款账号
      collect_money_account_name: e.detail.value.dealName, //收款人姓名
      seller_phone: e.detail.value.dealPhone, //手机号码
      code: e.detail.value.checkCode, //验证码
      version_name: this.data.product_title.product_name, //机型名称
      version_id: this.data.versionId, //机型id
      brand_name: this.data.product_title.brand_name, //品牌名字
      recycle_money: this.data.final_price, //估价
      version_infos_array: this.data.product_details, //机器信息
      money_account_type: e.detail.value.dealWay, //收款方式
      source: e.detail.value.source, //机器来源
      imei: e.detail.value.imei,
      token: this.data.token,
      // wxId: this.data.wxId,
      original_money: this.data.old_final_price, //没有加上加价卷金额的估价
      
      markup_money: this.data.product_title.markup_money, //加价卷金额
      markup_id: this.data.product_title.markup_id, //加价卷id

      //llq 范围加价券参数===============2021-9-2
      mrremark: this.data.product_title.markup_money != 0 ? this.data.product_title.mrremark : '', //哪种类型的加价券文字备注
      mstart_time: this.data.product_title.markup_money != 0 && '机型加价' != this.data.product_title.markup_money.mrremark ? this.data.product_title.start_time : '', //范围加价券开始
      mend_time: this.data.product_title.markup_money != 0 && '机型加价' != this.data.product_title.markup_money.mrremark ? this.data.product_title.end_time : '', //范围加价券结束
      //llq 范围加价券参数===========结束====2021-9-2


      isNew: this.data.isNew, //是否全新机
      other_money: this.data.other_money ? this.data.other_money : 0, //初始加价活动
    };
    console.log('order_params');
    console.log(order_params);
    console.log('order_params');
    let if_pass_phone, if_pass_account, if_pass_name;
    //验证
    if_pass_phone = mobile.test(order_params.seller_phone); //手机号验证
    mobile.test(order_params.collect_money_account) || check_mail.test(order_params.collect_money_account) || check_bank.test(order_params.collect_money_account) ? if_pass_account = true : if_pass_account = false; //收款账号验证
    if_pass_name = check_name.test(order_params.collect_money_account_name); //名字验证
    if (order_params.imei == undefined || order_params.imei == null || order_params.imei == 'undefined') order_params.imei = ''; //智能数码没有imei
    if (if_pass_phone) {
      if (order_params.code.length > 1) {
        if (if_pass_account) {
          if (if_pass_name && order_params.collect_money_account_name.length > 1 && order_params.collect_money_account_name.length < 9) {
            this.orderFun(order_params);
          } else {
            wx.showToast({
              title: '名字应由2-8位中文组成',
              icon: 'none',
              duration: 2000,
              mask: false
            })
          }

        } else {
          wx.showToast({
            title: '请输入有效的收款账号',
            icon: 'none',
            duration: 2000,
            mask: false
          })
        }

      } else {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 2000,
          mask: false
        })
      }

    } else {
      wx.showToast({
        title: '请输入有效的手机号码！',
        icon: 'none',
        duration: 2000,
        mask: false
      })
    }
  },
  //15084422039
  //下单函数
  orderFun: function (order_params) {
    console.log("下单下单2")
    wx.showLoading({
      mask: true,
    });
    if (order_params.token == null || order_params.token == undefined) order_params.token = '';
    if (order_params.wxId == null || order_params.wxId == undefined) order_params.wxId = '';
    switch (order_params.source) {
      case '0':
        order_params.source = '自己购买';
        break;
      case '1':
        order_params.source = '活动获得';
        break;
      case '2':
        order_params.source = '他人赠送';
        break;
    }
    let _this = this;
    console.log("order_params")
    //console.log(order_params)
    //order_params,order_params.token =22;
    wx.request({
      url: `${domain.domain_qupingce}/place/order/placeAnOrderFromWX`,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'firm':'jd'
      },
      data: order_params,
      dataType: 'json',
      method: 'post',
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.status === 200) {
            console.log(res.data)
            _this.setData({
              orderNumber: res.data.orderNumber
            });
            wx.setStorage({
              key: 'token',
              data: res.data.token,
            })
            wx.showModal({
              title: '报价已提交',
              content: '请及时寄出机器，并在个人中心填写发货信息，否则将导致延迟打款甚至无法完成回收',
              confirmText: '去发货',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  //console.log('用户点击确定')
                  wx.switchTab({
                    url: '/pages/mine/user',
                  })
                }
              }
            })
          } else if (res.data.status === 501) {
            _this.resLogin();

          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              mask: false
            })
          }
        } else {
          wx.showToast({
            title: '下单请求发送失败，请您联系客服',
            icon: 'none',
            duration: 4000,
            mask: false
          })
        }
      },
      fail: function (r) {
        // console.log('2222222222222222')
        // _this.orderFun();
        console.log(r);
        wx.showToast({
          title: '下单请求未发出',
          icon: 'none',
        })
      }
    })
    wx.hideLoading({
      mask: true,
    });
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
      success: function (re) {
        if (re.confirm) {
          wx.showLoading({
            title: "登录中...",
            mask: true
          })
          app.login(); //点击确认就重新登录
          //console.log(that.data.token)
          setTimeout(function () {
            that.setData({
              token: wx.getStorageSync('token')
            })
          }, 500);
          wx.hideLoading();
        }
      }
    })
  },
  showTeach: function () {
    wx.showModal({
      title: '如何查看序列号/IMEI',
      content: '手机在拨号界面输入*＃06＃,即可查看imei,平板在设置-关于本机，即可查看序列号/IMEI，新机可从包装盒查看(部分双卡手机会有两个IMEI,通常以第一个为准)',
      confirmText: '我知道了',
      showCancel: false,
      decode: 'true',
      success(res) {
        if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  //勾选协议
  agreeFun: function (event) {
    let it = this;
    let type = event.currentTarget.dataset.type;
    if (type === 'no') {
      // 点击勾选
      it.setData({
        isAgree: true
      })
    } else if (type === 'yes') {
      //点击取消勾选
      it.setData({
        isAgree: false
      })
    }
  },
  /**
   * 弹出层函数
   */
  myModalShow: function () {
    this.setData({
      showModal: true
    })
  },
  preventTouchMove: function () {
    //此空函数阻止touchmove向下冒泡传递
  },
  closeModal: function () {
    this.setData({
      showModal: false
    })
  },
  /**
   * 弹出层函数end
   */
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})