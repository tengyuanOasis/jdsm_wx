// components/Dialog/dialog.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹窗标题
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: String,
      value: '弹窗内容'
    },


    // 弹窗取消按钮文字
    cancelText: null,
    // 弹窗确认按钮文字
    confirmText: null,
    contact:null

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 弹窗显示控制
    isShow: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //2秒后自动关闭
    autoHideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
      var that = this;
      setTimeout(function () {
        that.setData({
          isShow: !that.data.isShow
        })
      }, 2000)
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent");
    }
    ,
    _hide(){
      this.triggerEvent("hide");
    }
  }
})
