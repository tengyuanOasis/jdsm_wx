class tips {
  //200成功时候的提示
  static SUCCESS_200(msg = '成功的请求！') {
    return wx.showToast({
      title: msg,
      icon: 'success',
      duration: 2000,
      mask: true
    })
  }
  //通用的异常处理
  static ERROR_COMMON(msg = '暂无网络！') {
    return wx.showToast({
      title: msg,
      image: '/images/icon/common_error.png',
      duration: 2000,
      mask: true
    })
  }
  //500000错误码弹框
 static ERROR_500000(msg = '请求异常') {
    return wx.showToast({
      title: msg,
      image: '/images/icon/500000_error.png',
      duration: 2000,
      mask: true
    })
  }
  //500暂无网络状态码
  static ERROR_500(msg='暂无网络！'){
    return wx.showToast({
      title: msg,
      image: '/images/icon/500_error.png',
      duration: 2000,
      mask: true
    })
  }
  static ERROR_401(msg = '授权失败！') {
    return wx.showToast({
      title: msg,
      image: '/images/icon/401_error.png',
      duration: 2000,
      mask: true
    })
    //隐藏：wx.hideToast()
  }

  //加载提示
  static LOADING(msg='加载中...'){
    return wx.showLoading({
      title:msg,
      mask:true
    })
    //隐藏:wx.hideLoading()
  }
  //模态框
  static MODAL(title,content,successF){
    wx.showModal({
      title: title,
      content: content,
      showCancel:false,
      success(res) {
        if (res.confirm) {
          if (successF){
            successF()
          }
        }
      }
    })
  }

}
export {tips}