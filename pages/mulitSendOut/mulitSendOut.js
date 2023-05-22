// pages/mulitSendOut/mulitSendOut.js
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
    choseArray:[],//选中的订单号数组
    allOrders: [], //待发货订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrders();
  },
  //获取全部订单，并只取出待发货的订单
  /**
   * 获取近期订单
   * 
   */
  getOrders: function () {
    var token = wx.getStorageSync("token");
    var it = this;
    it.setData({
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
        it.setData({
          dataLoad: false
        })
        if (r.data.status == 200) {
          //筛选出待发货的订单
          let tempArray = [];
          for (let k in r.data.data) {
            if (r.data.data[k].order_status == 'waitdelivery') {
              r.data.data[k].isChose = false;
              tempArray.push(r.data.data[k]);
            }
          }
          console.log(tempArray)
          it.setData({
            allOrders: tempArray,
          })
        }

      },
      fail: function (err) {}, //请求失败
      complete: function (r) {} //请求完成后执行的函数
    })

  },
  //勾选函数
  choseFun:function(e){
    let it = this;
    let crtId = e.currentTarget.dataset.number;
    let datas = it.data.allOrders;
    let choseArray = [];
    for(let i in datas){
      if(datas[i].order_number == crtId){
        //选中状态取反
        datas[i].isChose = !datas[i].isChose;
      }
      //将选中的订单存起来
      if(datas[i].isChose){
        let temp = {
          seller_time:datas[i].seller_time,
          number:datas[i].order_number,
          name:datas[i].version_name,
          price:datas[i].secondary_recycle==0?(datas[i].recycle_money):(datas[i].secondary_recycle),
        };
        choseArray.push(temp);
      }
    }
    it.setData({
      allOrders:datas,
      choseArray:choseArray,
    });
   // choseArray = JSON.stringify(choseArray)
    console.log(choseArray)
  },
  //提交
  commit:function(){
    let it = this;
    let param = it.data.choseArray;
    if(param.length>5){
      wx.showToast({
        title: '最多5个订单',
        icon:'none',
      });
      return;
    }
    if(param.length<1){
      wx.showToast({
        title: '至少选择一个订单',
        icon:'none',
      })
      return;
    }
    wx.showActionSheet({
      itemList: ['在线预约顺丰上门取件（推荐）','自行发货填写单号，限顺丰快递',],
      success(res){
        if(res.tapIndex == 0){
          wx.redirectTo({
            url: '/pages/onlineexpress/onlineexpress?orders='+JSON.stringify(param),
          })
        }else if(res.tapIndex == 1){
          wx.redirectTo({
            url: '/pages/sellerexpress/sellerexpress?orders='+JSON.stringify(param),
          })
        }
      }
    })
  },
  /* 下拉刷新 */
  onPullDownRefresh: function () {
    this.getOrders();
    wx.stopPullDownRefresh();
  },
})