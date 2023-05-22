// pages/showcountprice/showcountprice.js
import {
  commonDomain as domain
} from "../../constant/common";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '', //手机号
    product_title: '',
    //机器基本信息
    final_price: 0,
    //报价
    old_final_price: 0,
    product_details: [], //选中详情

    //同行百分比
    percent_pri: '90',
    //下月预计跌
    next_month_cut: '99'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let _key = "";

    wx.getStorage({
      key: 'product_title',
      success(res) {
        _this.setData({
          product_title: res.data
        })

        _key = res.data.product_name + "001";

        if (wx.getStorageSync("_key") != "") {
          console.log("有缓存")

          //取缓存
          _this.setData({
            percent_pri: wx.getStorageSync("_key").split("-")[0],
            next_month_cut: wx.getStorageSync("_key").split("-")[1]
          });
        } else {

          let val1 = _this.random(85, 99);
          let val2 = _this.random(70, 230);
          console.log("没有缓存")

          wx.setStorageSync('_key', val1 + "-" + val2); //存缓存
          _this.setData({
            percent_pri: val1,
            next_month_cut: val2
          });


        }


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
      key: 'phoneNumber',
      success(res) {
        _this.setData({
          phoneNumber: res.data
        })
      }
    })

  },
  random: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  getPhoneNumber: function (e) {
    let self = this;
    console.log("换钱")
    if (self.data.phoneNumber) {
      wx.navigateTo({
        url: '/pages/orderpage/orderpage',
      });
    } else {
      if (e.detail.iv) {
        wx.showLoading();
        wx.request({
          url: `${domain.domain_qupingce}/user/wx/getPhoneNumber`,
          data: {
            code: wx.getStorageSync('powerCode'),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
          },
          header: {
            "Content-Type": "applciation/json",
            "firm":"jd"
          },
          method: "get", //get为默认方法/POST
          success: function (r) {
            wx.hideLoading();
            if (r.data.code == 200) {
              //console.log(r.data);
              wx.setStorageSync('phoneNumber', r.data.token.phoneNumber);
              self.setData({
                phoneNumber: r.data.token.phoneNumber,
              });
              app.login();
              setTimeout(() => {
                wx.hideLoading();
                wx.navigateTo({
                  url: '/pages/orderpage/orderpage',
                });
              }, 1000)
            }

          },
          fail: function (err) {}, //请求失败
          complete: function (r) {} //请求完成后执行的函数
        })
      } else {
        wx.showToast({
          title: '请您先授权后再下单',
          icon: "none",
          duration: 2000,
          mask: true
        });
        return;
      }

    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})