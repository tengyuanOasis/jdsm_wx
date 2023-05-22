// pages/search/search.js
import {
  commonDomain as domain
} from "../../constant/common";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    focus: true,
    prikey: "",
    searchArray: [],
    //根据关键字查的机型数组
    latestArray: [] //历史搜索缓存数据

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      latestArray: []
    });

    if (wx.getStorageSync('latestArray').length > 0) {
      //取缓存
      this.setData({
        latestArray: wx.getStorageSync('latestArray')
      });
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getkey: function (e) {
    var oldkey = this.data.prikey;
    this.setData({
      prikey: e.detail.value
    });

    if (this.data.prikey != oldkey) {
      let _this = this;

      wx.request({
        url: `${domain.domain_qupingce}/search/serarchByKey`,
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          key: _this.data.prikey,
          company: "jd"
        },
        method: 'GET',
        success(res) {
          if (res.statusCode == '200') {
            //请求状态码
            if (res.data.status == '200') {
              //后台返回成功状态码
              _this.setData({
                searchArray: res.data.data //搜索机型数组赋值
              });
            }
          }
        }

      });
    }
  },
  enterFun: function (e) {
    var item = e.currentTarget.dataset.variable;
    if (wx.getStorageSync('latestArray').length > 0) {
      this.setData({
        latestArray: wx.getStorageSync('latestArray')
      });
      var arr = this.data.latestArray;
      var ret = arr.findIndex((value, index, arr) => {
        //缓存数组排重
        return value.version_id == item.version_id;
      });

      if (ret == -1) {
        //缓存数组不存在当前搜索
        this.data.latestArray.unshift(item);
      }
    } else {
      this.data.latestArray.unshift(item);
    }

    wx.setStorageSync('latestArray', this.data.latestArray); //存缓存

    if (item.flag == "main" || item.flag == "digital" & item.type_name == "watch") {
      wx.navigateTo({
        url: "/pages/placeordersteps/placeordersteps?versionId=" + item.version_id
      });
    } else {
      wx.navigateTo({
        url: "/pages/digitalordersteps/digitalordersteps?versionId=" + item.version_id
      });
    }
  },
  clearHisStor: function () {
    //清空历史纪录
    let _this = this;
    if (wx.getStorageSync('latestArray').length > 0) {
      wx.showModal({
        title: '',
        content: '确定要清空所有历史记录吗',
        success(res) {
          if (res.confirm) {
            wx.removeStorageSync("latestArray");
            _this.setData({
              latestArray: []
            })
          }
        }
      })
    }
  },
  serviceConsult: function () { //联系客服
    // var url = 'http://p.qiao.baidu.com/cps/chat?siteId=12191591&userId=25807133&c' +
    //   'p=%E6%9D%A5%E8%87%AA%E5%9B%9E%E6%94%B6%E7%BD%91%E7%AB%99&cr=%E5%9B%9E%E6%94%B6%E7%BD%91%E7%AB%99&cw=%E8%B6' +
    //   '%A3%E8%AF%84%E6%B5%8B%E5%9B%9E%E6%94%B6%E5%AE%A2%E6%88%B7';
    // wx.navigateTo({
    //   url: "/components/webviewpage/webviewpage?paramUrl=" + url,
    // })
  },
  getSearchKeyByHis: function (e) {
    var item = e.currentTarget.dataset.variable;
    this.setData({
      prikey: item.version_name
    })

    this.data.focus = true;

    let _this = this;
    wx.request({
      url: `${domain.domain_qupingce}/search/serarchByKey`,
      data: {
        key: _this.data.prikey,
        company: "jd"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.statusCode == '200') { //请求状态码
          if (res.data.status == '200') { //后台返回成功状态码
            _this.setData({
              searchArray: res.data.data //搜索机型数组赋值
            })
          }
        }
      }
    })

  }
})