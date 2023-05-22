// components/kefuservice/kefuservice.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    move: function (e) {
      console.log(move);
    },
    kffunc: function () {
      this.setData({
        isShowEditModel: true
      })
    },
    closekf: function () {
      this.setData({
        isShowEditModel: false
      })
    },
    copyAddress: function () {
      wx.setClipboardData({
        data: 'jianduan123123',
        success(res) {
          wx.getClipboardData({
            success(res) {
              // console.log(1) // data
            }
          })
        }
      })
    },
    copyPhone: function () {
      wx.setClipboardData({
        data: '18475563915',
        success(res) {
          wx.getClipboardData({
            success(res) {
              // console.log(1) // data
            }
          })
        }
      })
    },
  }
})