// pages/user/testReport/testReport.js
import {
  commonDomain as domain
} from "../../constant/common";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: domain.domain_qupingce,
    main_data: {},
    machineCode: '',
    order_number: '',
    passOptions:{'95新':true,'99新':true,'完美':true,'无锁':true,'全绿':true,'无ID':true,'正常':true,}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //只保留订单号里的数字
    this.setData({
      myorder_id: options.myorder_id,
      name:options.name,
      imei:options.imei
    });
    //
    this.getTest();

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getTest();
    //完成后关闭刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 获取验机报告
   */
  getTest: function () {
    var that = this;
    wx.request({
      url: `${domain.domain_qupingce}/view/order/getOrderTest?order_id=` + that.data.myorder_id,
      headers: {
        "Content-Type": "applciation/json"
      },
      method: "Post",
      success: function (r) {
        if (r.data.status == 200) {
          //加上是否折叠标志
          for (let k = 0; k < r.data.data.length; k++) {
            if( r.data.data[k].option_name==r.data.data[k].test_option_name){
              r.data.data[k].isPass = true;
            }else{
              r.data.data[k].isPass = false;
            }
            
          }
          that.setData({
            main_data: r.data.data
          });
          console.log(that.data.main_data);
        } else {
          my.alert({
            title: '提示',
            content: '暂无验机报告哦～',
            confirmText: '我知道了',
            success(res) {
              setTimeout(function () {
                my.navigateBack();
              }, 800)
            }

          });
        }
      },
      fail: function (err) { },
      //请求失败
      complete: function (r) { } //请求完成后执行的函数

    });
  },
  //预览图片
  checkImage: function (event) {
    let it = this;
    let url = `${domain.domain_qupingce}`+ event.target.dataset.img;
    console.log(url)
     wx.navigateTo({
      url: '/pages/testReport/checktestimg/checktestimg?url=' +encodeURIComponent(url)
    });
  },

  /**
   * 提示
   * 
   */
  isShowToast: function (title) {
    this.setData({
      toastShow: true,
      title: title
    });
    var that = this;
    setTimeout(function () {
      that.setData({
        toastShow: false
      });
    }, 1500);
  }
})