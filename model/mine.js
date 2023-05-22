import {
  tips
} from '../utils/tips'
import {
  commonDomain as domain
} from '../constant/common'
/*
我的优惠卷请求业务逻辑处理
 */
class mine {
  //获取该用户所有的优惠卷信息
  /*
   *token:用户的身份凭证
   */
  getAllCoupons(token, sCallback) {
    return wx.request({
      url: `${domain.domain_qupingce}/getCouponsBySeller`,
      type:'GET',
      data:{
        token:token
      },
      success: function (res) {
        if(res.statusCode==200){
          sCallback(res.data)
        }else{
          tips.ERROR_500();
        }
      },
      fail: function (res) {
        console.log(1)
        tips.ERROR_500();
      },
    })
  }
  /*
  //获取路由信息
  */
  getRoute(routeApi,token,expressNum,sCallback){
    //请求物流接口数据
    wx.request({
      url: `${domain.domain_qupingce}${routeApi}`,
      method: 'GET',
      data: {
        e_number: expressNum,
        token: token,
        firm:"jd"
      },
      dataType: 'json',
      success: function (res) {
        if (res.statusCode == 200) {
          sCallback(res.data)
        } else {
          tips.ERROR_500();
        }
      },
      fail: function (err) {
      tips.ERROR_500();
      }
    })
  }

}
export {
  mine
}