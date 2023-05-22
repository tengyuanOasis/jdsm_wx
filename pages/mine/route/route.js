import {
  tips
} from '../../../utils/tips'
import {
  commonDomain as domain
} from "../../../constant/common"
import {
  mine as route
} from '../../../model/mine'
const myRoute = new route();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: domain.domain_qupingce,
    expressNum: "", //快递单号
    routeList: [], //物流数据
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (wx.getStorageSync("phoneNumber") == null || wx.getStorageSync("phoneNumber")==''){
     tips.ERROR_401("您还没有登录")
   }
    let _this = this
    let expressNum = options.expressNum //页面传递过来的快递单号
    let expressCompany = options.exprssCompany //页面传递过来的快递公司
    let token = wx.getStorageSync("token") //从缓存中获取token身份凭证
    let routeApi = "/order/logistics/sf" //查询顺丰物流的api
    if (expressNum == null || expressNum == "" || expressCompany == "" || expressCompany == null) {
      tips.ERROR_500('暂无网络！')
    } else if (token == null || token == "") {
      tips.ERROR_401("登录过期！")
    } else {
      if (expressCompany != "顺丰快递") {
        routeApi = "/order/logistics/ot" //查询其它物流的快递api
      }
      myRoute.getRoute(routeApi, token, expressNum, function(res) {
        if (res.status == "200") {
          _this.setData({
            expressNum: expressNum,
            userInfo: wx.getStorageSync("userInfo")
          })
          _this.collectionData(res.data) //归纳这些路由数据
        } else {
          tips.MODAL('物流异常',res.msg)
        }
      })
    }
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
    //完成后关闭刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  //归纳服务器返回的路由数据
  collectionData(data) {
    let mapList = new Map();
    let mapListArray = [];

    if (data.Head == "OK") {
      for (let [index, value] of data.routeList.entries()) {
        let key = value.day + "," + value.week;

        if (mapList.has(key)) {
          mapList.get(key).push({
            time: value.time,
            remark: value.remark
          });
        } else {
          let valueArray = [];
          valueArray.push({
            time: value.time,
            remark: value.remark
          });
          mapList.set(key, valueArray);
        }
      }

      for (let [K, V] of mapList.entries()) {
        mapListArray.push({
          key: K,
          value: V,
          length: V.length
        });
      }

      this.setData({
        routeList: mapListArray
      });
    } else {
      tips.ERROR_500('网络跑丢啦！#2');
    }
  }
})