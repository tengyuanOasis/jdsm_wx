import {
  tips
} from '../../utils/tips'
import {
  commonDomain as domain
} from '../../constant/common'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: '',
    brandId: '', //品牌Id
    typeId: '', //类型ID
    typeName: '', //类型名字
    digitalList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取上一个页面传递过来的数据
    this.setData({
      brandId: options.brandId,
      typeId: options.typeId,
      typeName: options.typeName,
      domain: domain.domain_qupingce
    })

    let _this = this
    //初始化页面的数据
    wx.request({
      url: `${domain.domain_qupingce}/page/getIRVersion`,
      type: 'GET',
      data: {
        brandId: this.data.brandId,
        typeId: this.data.typeId,
        typeName: this.data.typeName,
        company: "jd"
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.status == 200) {
            _this.setData({
              digitalList: res.data.data
            })
          } else {
            tips.ERROR_500000(res.data.msg)
          }
        } else {
          tips.ERROR_500()
        }
      },
      fail: function(err) {
        tips.ERROR_500();
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  //跳转到去估价页面
  gotoCountPrice(event) {
    let versionId = event.currentTarget.dataset.versionId
    let typeName=this.data.typeName
    if (versionId == null || versionId == '') {
      tips.ERROR_500()
    } else {
      //如果类型名字不为手表就跳到通用的估价页面去
      if (typeName != 'watch') {
        /**
         * TODO:非手表的估价页面
         */
        wx.navigateTo({
          url: `/pages/digitalordersteps/digitalordersteps?versionId=${versionId}&typeName=${typeName}`,
        })
      } else { //如果为手表的话就跳转到通用的页面进行处理
        wx.navigateTo({
          url: `/pages/placeordersteps/placeordersteps?versionId=${versionId}&typeName=${typeName}`
        })
      }

    }
  },
})