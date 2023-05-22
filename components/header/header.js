// components/header/header.js
Component({
  options: {
    multipleSlots: true, //开启使用插槽
  },
  externalClasses: ['bg'],
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: String,
      value: 'true',
    },
    headerclass: {
      type: String,
      value: 'header'
    }
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
    mainsearch: function() {
      wx.navigateTo({
        url: '/pages/search/search',
      })
    }
  }
})