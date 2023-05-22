import {tips} from "./tips"
//promise请求方式
class HTTP {
  /**
   * url:'请求地址'，
   * data:{}，//请求数据
   * method:''//请求方法,不传默认为GET方式
   */
  request({
    url,
    data = {},
    method = 'GET'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, method, data, resolve, reject)
    })
  }
  _request(url, method = 'GET', data = {}, resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {//请求状态码不等于200的时候统一报500，暂无网络的错误
          tips.ERROR_500()
        }
      },
      fail: (err) => {
        tips.ERROR_500()
      }
    })
  }
}
export {
  HTTP
}