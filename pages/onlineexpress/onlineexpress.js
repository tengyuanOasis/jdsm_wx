import {
  tips
} from "../../utils/tips"
import {
  commonDomain as domain
} from "../../constant/common"
import {
  dateTimePicker,
  getMonthDay,
  getMaxMonthDay
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: domain.domain_qupingce,
    paramData: null,
    userInfo: {}, //用户信息
    orderInfo: null, //上一个页面传递过来的订单信息
    region: [], //默认地址
    remarkClass: null,
    dateTimeArray: null,
    dateTime: null,
    orderDate: null, //下单时间
    failDate: null, //订单失效时间
    failDate1: null, //订单失效时间
    startYear: null, //开始的年份
    endYear: null, //结束的年份
    startMonth: null,
    endMonth: null,
    phoneNumber:'',
    startDay: null, //开始的时间
    endDay: null, //结束的时间
    flagYear: null //设置一个变量标记上一次选择的年份，以此来判断是否需要重新初始化月份信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.paramData = options
    this.initData(options)
    this.initDate();
    this.setData({
      phoneNumber: wx.getStorageSync('phoneNumber')
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initData(this.data.paramData)
    wx.stopPullDownRefresh()
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
  initData(paramData) {
    var _this = this
    if (paramData.orders == null || paramData.orders == undefined) {
      tips.ERROR_500()
      return
    }
    let orderStr = decodeURIComponent(paramData.orders) //获得单条订单信息
    //获取下单的时间，提取出来年份和月份
    //wayne（2020-08-07）:这里改为升级多订单发货后，默认选择第一个订单的时间为准JSON.parse(orderStr)[0]
    var order_time = (JSON.parse(orderStr)[0].seller_time).replace(/-/g, '/')
    if (order_time == null || order_time == undefined) {
      tips.ERROR_500()
      return
    }
    var orderDate = new Date(order_time)
    //3天后的时间为
    var failDate = new Date(order_time)
    failDate.setDate(orderDate.getDate() + 2)
    var failDate1 = new Date(order_time)
    failDate1.setDate(orderDate.getDate() + 3)
    _this.setData({
      orderDate: orderDate,
      failDate: failDate,
      failDate1: failDate1,
      startYear: orderDate.getFullYear(), //开始的年份
      endYear: failDate.getFullYear(), //结束的年份
      startMonth: orderDate.getMonth() + 1, //开始月份
      endMonth: failDate.getMonth() + 1, //结束月份
      startDay: orderDate.getDate(), //开始的时间
      endDay: failDate.getDate(), //结束的时间
      flagYear: new Date().getFullYear() //默认为当前所在年份
    })
    let phoneNumber = wx.getStorageSync("phoneNumber") //从缓存中获取用户的信息
    console.log(phoneNumber)
    if (phoneNumber == null) {
      tips.ERROR_401()
      return;
    } else if (orderStr == null) {
      tips.ERROR_500()
      return;
    }
    _this.setData({
      orderInfo: JSON.parse(orderStr)[0]
    })
  },
  //初始化时间数据
  initDate() {
    //初始化时间的时候需要考虑到天数跨月不一样的情况
    var startMonth = this.data.startMonth
    var endMonth = this.data.endMonth
    var obj = null
    if (startMonth != endMonth) {
      //获取下单时间的月份最大天数
      var maxDay = getMaxMonthDay(this.data.startYear, startMonth)
      if (maxDay == 0) {
        tips.ERROR_500()
        return
      }
      //需要判断是否年份相同
      if (this.data.startYear != this.data.endYear) {
        //获取当前所在时间的年份信息
        let nowYear = new Date().getFullYear()
        //如果当前时间和开始年份不相等，那么默认就初始化下一年的数据
        if (nowYear != this.data.startYear) {
          // 获取完整的年月日 时分秒，以及默认显示的数组
          obj = dateTimePicker(this.data.startYear, this.data.endYear, 1, 1, 1, this.data.endDay)
        } else {
          // 获取完整的年月日 时分秒，以及默认显示的数组
          obj = dateTimePicker(this.data.startYear, this.data.endYear, 12, 12, this.data.startDay, maxDay)
        }
      } else { //如果年份相同月份不同默认先初始化开始月的数据
        //判断当前月份是否可开始月份相同
        let nowMonth = new Date().getMonth() + 1;
        if (nowMonth == this.data.startMonth) {
          obj = dateTimePicker(this.data.startYear, this.data.endYear, startMonth, endMonth, this.data.startDay, maxDay)
        } else {
          obj = dateTimePicker(this.data.startYear, this.data.endYear, startMonth, endMonth, 1, this.data.endDay)
        }
      }
    } else {
      obj = dateTimePicker(this.data.startYear, this.data.endYear, startMonth, endMonth, this.data.startDay, this.data.endDay)
    }
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj.dateTimeArray.pop()
    var lastTime = obj.dateTime.pop()
    this.setData({
      dateTimeArray: obj.dateTimeArray,
      dateTime: obj.dateTime
    })
  },
  //时间选择器
  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    })
  },
  withData(param) {
    return param < 10 ? '0' + param : '' + param;
  },
  changeDateTimeColumn(e) {
    var _this = this
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;

    var startMonth = _this.data.startMonth
    var endMonth = _this.data.endMonth
    var currYear = dateArr[0][arr[0]] //获取到当前选中的年份
    var obj = null
    //如果选择的年份不一样，那么就重新初始化月份信息
    if (currYear != _this.data.flagYear) {
      if (currYear != _this.data.startYear) {
        var endTime = _this.data.failDate.getFullYear() + "-" + _this.withData(_this.data.failDate.getMonth() + 1) + "-" + _this.withData(_this.data.failDate.getDate()) + " " + _this.withData(_this.data.failDate.getHours()) + ":" + _this.withData(_this.data.failDate.getMinutes()) + ":00"
        obj = dateTimePicker(_this.data.startYear, _this.data.endYear, 1, 1, 1, _this.data.endDay, endTime) //如果是跨年份的话就设置为下一年的1月份,并且需要传递当前的默认显示时间
      } else {
        var beginTime = _this.data.orderDate.getFullYear() + "-" + _this.withData(_this.data.orderDate.getMonth() + 1) + "-" + _this.withData(_this.data.orderDate.getDate()) + " " + _this.withData(_this.data.orderDate.getHours()) + ":" + _this.withData(_this.data.orderDate.getMinutes()) + ":00"

        obj = dateTimePicker(_this.data.startYear, _this.data.endYear, 12, 12, _this.data.startDay, 31, beginTime) //如果是跨年份的话就设置为下一年的1月份,并且需要传递当前的显示时间信息
      }
      // 精确到分的处理，将数组的秒去掉
      var lastArray = obj.dateTimeArray.pop()
      var lastTime = obj.dateTime.pop()
      _this.setData({
        dateTimeArray: obj.dateTimeArray,
        dateTime: obj.dateTime,
        flagYear: currYear
      })
      return
    }
    if (startMonth != endMonth) {
      var maxDay = getMaxMonthDay(dateArr[0][arr[0]], startMonth)
      if (maxDay == 0) {
        tips.ERROR_500()
        return
      }
      if (dateArr[1][arr[1]] == (startMonth < 10 ? '0' + startMonth : '' + startMonth)) {
        dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]], _this.data.startDay, maxDay);
      } else {
        dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]], 1, _this.data.endDay);
      }

    } else {
      dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]], _this.data.startDay, _this.data.endDay);
    }
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  //地区选择器
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
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
  //表单提交事件
  formSubmit(e) {
    let _this = this
    /**对数据进行校验 */
    let formData = e.detail.value //获取表单里面的数据
    if (formData.j_contact == null || formData.j_contact == '') {
      tips.ERROR_500000('请填写联系人')
      return
    }
    if (!/^[\u4e00-\u9fa5]+$/.test(formData.j_contact)) {
      tips.ERROR_500000('联系人为中文')
      return
    }
    if (formData.j_contact.length > 10) {
      tips.ERROR_500000('名字长度小于10')
      return
    }
    if (formData.j_province_city_county == null || formData.j_province_city_county == '') {
      tips.ERROR_500000('请选择省市区')
      return
    }
    if (formData.j_address == null || formData.j_address == '') {
      tips.ERROR_500000('请填写详细地址')
      return
    }
    if (formData.sendstarttime == null || formData.sendstarttime == '') {
      tips.ERROR_500000('请选择预约时间')
      return
    }
    if (formData.remark != null && formData.remark.length > 50) {
      tips.ERROR_500000('备注小于50个字')
      return
    }
    //获取当前时间到分钟
    let nowDate = new Date()
    let minuteTimeNow = nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + " " + nowDate.getHours() + ":" + nowDate.getMinutes() + ":00";
    let dayTimenow = nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() //取出时间到天
    if ((new Date(formData.sendstarttime.replace(/-/g, "\/"))) < (new Date(minuteTimeNow))) {
      tips.MODAL('错误提示', '预约的时间必须大于当前时间')
      return
    }
    if ((new Date(formData.sendstarttime.replace(/-/g, "\/"))) > _this.data.failDate1) {
      tips.MODAL('错误提示', '订单有效期至：' + _this.data.failDate1.toLocaleString())
      return
    }
    // if ((new Date(formData.sendstarttime.replace(/-/g, "\/"))) > (new Date(dayTimenow + " 17:59:59")) || (new Date(formData.sendstarttime.replace(/-/g, "\/"))) < (new Date(dayTimenow + " 09:00:00"))) {
    //   tips.MODAL('错误提示', '预约时间段为：9:00~18:00')
    //   return
    // }
    //封装请求数据
    //按格式组合多个订单号
    let orderNumbers = _this.data.orderInfo.order_number
   
    let data = {
      order_numbers: orderNumbers,
      j_contact: formData.j_contact, //必填
      //j_contact: '15084422026', //必填
      j_province: formData.j_province_city_county.split('|')[0].trim(), //必填
      j_city: formData.j_province_city_county.split('|')[1].trim() == '县' ? formData.j_province_city_county.split('|')[0].trim() : formData.j_province_city_county.split('|')[1].trim(), //必填
      j_county: formData.j_province_city_county.split('|')[2].trim(), //必填
      j_address: formData.j_address, //必填
      sendstarttime: formData.sendstarttime, //必填【yyyy-MM-dd HH:mm:ss】格式，预约时间段为预约时间段为9：00-18：00！
      remark: formData.remark, //非必填（长度小于50）
      token: wx.getStorageSync('token') ,//必填
      company:"jd"
    }
    tips.LOADING('订单处理中...')
    wx.request({
      url: `${_this.data.domain}/place/order/onlineOrder`,
      method: 'POST',
      data: data,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          if (res.data.status == 200) {
            //总数量减去失败数量
            let sucessCount = _this.data.orderInfo.length - res.data.data.length;
            wx.showModal({
              title: '预约结果',
              showCancel: false,
              content: `预约成功`,
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/mine/user',
                  })
                } else if (res.cancel) {
                  wx.switchTab({
                    url: '/pages/mine/user',
                  })
                }
              }
            })

          } else {
            tips.MODAL('预约失败', res.data.msg)
          }
        } else {
          tips.ERROR_500();
        }
      },
      fail: function () {
        tips.ERROR_500();
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  toSellerexpress:function(e){
    var order = e.target.dataset.order;
    let param = [order];
    param=JSON.stringify(param);
    wx.navigateTo({
      url: '/pages/sellerexpress/sellerexpress?orders=' + encodeURIComponent(param),
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