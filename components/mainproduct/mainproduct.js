import {
  tips
} from '../../utils/tips'
import {
  commonDomain as domain
} from '../../constant/common'
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    domainName: '',
    signClass: "phone",
    brandId: '85001ac13f7e4c56ab949328165e0ed6',
    flag: 'main',
    type: 'phone',
    typeId: '',
    typeName: '',
    brandList: [],
    productList: [],
    typeList: [],
    digitalBrandList: [],
    windowHeight: 555,
    page: 1,
    limit: 15,
    total: 0,
  },
  methods: {
    loadMore: function () {
      let _this = this;

      if (_this.data.page + 1 <= this.data.total) {
        _this.setData({
          page: _this.data.page + 1
        });

        wx.showLoading({
          content: '加载中～',
        })
        wx.request({
          url: `${domain.domain_qupingce}/page/ChooseTypeByBrandByPage`,
          method: 'GET',
          data: {
            type: _this.data.type,
            brandId: _this.data.brandId,
            page: _this.data.page,
            limit: _this.data.limit,
            company: "jd"
          },
          success: function (res) {
            if (res.statusCode == 200) {
              if (res.data.status == 200) {
                _this.setData({
                  productList: _this.data.productList.concat(res.data.data),
                  total: Math.ceil(res.data.total / _this.data.limit) //小数向前进1

                });
              } else {
                tips.ERROR_500();
              }
            }
          },
          fail: function (err) {
            tips.ERROR_500();
          },
          complete: function () {
            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
          }
        });

      }
    },
    loadMoreForDigital: function () {
      let _this = this;

      if (_this.data.page + 1 <= this.data.total) {
        _this.setData({
          page: _this.data.page + 1
        });

        //setTimeout(() => {
        wx.showLoading({
          content: '加载中～',
        })
        wx.request({
          url: `${domain.domain_qupingce}/page/getIRBrandByPage`,
          method: 'GET',
          data: {
            type_id: _this.data.typeId,
            page: _this.data.page,
            limit: _this.data.limit
          },
          success: function (res) {
            if (res.status == 200) {
              let firstTypeId = '';
              let firstTypeName = '';

              if (res.data.data.data.length > 0) {
                firstTypeId = res.data.data.data[0].type_id;
                firstTypeName = res.data.data.data[0].type_name;
              }

              if (res.data.status == 200) {
                _this.setData({
                  digitalBrandList: _this.data.digitalBrandList.concat(res.data.data.data),
                  typeId: firstTypeId,
                  typeName: firstTypeName,
                  total: res.data.data.data.total
                });
              } else {
                tips.ERROR_500();
              }
            }
          },
          fail: function (err) {
            tips.ERROR_500();
          },
          complete: function () {
            _this.setData({
              isShow: false
            });
          }
        });
      }
    },
    initMainProduct: function () {
      let _this = this; 

      wx.request({
        url: `${domain.domain_qupingce}/page/getAllBrandByType`,
        method: 'GET',
        data: {
          type: _this.data.type
        },
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == 200) {
              _this.setData({
                brandList: res.data.data
              });
            } else {
              tips.ERROR_500();
            }
          }
        },
        fail: function (err) {
          tips.ERROR_500();
        }
      }); 

      wx.request({
        url: `${domain.domain_qupingce}/page/ChooseTypeByBrandByPage`,
        method: 'GET',
        data: {
          type: _this.data.type,
          brandId: _this.data.brandId,
          page: _this.data.page,
          limit: _this.data.limit,
          company: "jd"
        },
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == 200) {
              _this.setData({
                productList: res.data.data,
                total: Math.ceil(res.data.total / _this.data.limit),
                //小数向前进1
                //isShow: false
              });
            } else {
              tips.ERROR_500();
            }
          }
        },
        fail: function (err) {
          tips.ERROR_500();
        }
      });
    },
    initDigitalProduct() {
      let _this = this;
      wx.request({
        url: `${domain.domain_qupingce}/page/getIRTypeList`,
        method: 'GET',
        data: '',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == 200) {
              _this.setData({
                typeList: res.data.data
              });
            } else {
              tips.ERROR_500();
            }
          }
        },
        fail: function (err) {
          tips.ERROR_500();
        }
      }); 

      wx.request({
        url: `${domain.domain_qupingce}/page/getIRBrandByPage`,
        method: 'GET',
        data: {
          type_id: _this.data.typeId,
          page: _this.data.page,
          limit: _this.data.limit
        },
        success: function (res) {
          if (res.statusCode == 200) {
            let firstTypeId = '';
            let firstTypeName = '';

            if (res.data.data.data.length > 0) {
              firstTypeId = res.data.data.data[0].type_id;
              firstTypeName = res.data.data.data[0].type_name;
            }

            if (res.data.status == 200) {
              _this.setData({
                digitalBrandList: res.data.data.data,
                typeId: firstTypeId,
                typeName: firstTypeName,
                total: res.data.data.total
              });
            } else {
              tips.ERROR_500();
            }
          }
        },
        fail: function (err) {
          tips.ERROR_500();
        }
      });
    },
    changeType: function (event) {
      wx.removeStorageSync('brandId') 
      if (event.currentTarget.dataset.type != 'digital') {
        this.setData({
          signClass: event.currentTarget.dataset.type,
          type: event.currentTarget.dataset.type,
          flag: 'main',
          brandId: '85001ac13f7e4c56ab949328165e0ed6',
          page: 1,
          total: 0
        });
        this.initMainProduct();
      } else {
        this.setData({
          signClass: event.currentTarget.dataset.type,
          type: event.currentTarget.dataset.type,
          flag: 'digital',
          brandId: '85001ac13f7e4c56ab949328165e0ed6',
          page: 1,
          total: 0
        });
        this.initDigitalProduct();
      }
    },


    changeBrandItemBymain(event) {
      this.setData({
        brandId: event.currentTarget.dataset.brandId,
        page: 1,
        total: 0
      })
      this.initMainProduct()
    },
    changeBrandItemByDigital(event) {
      this.setData({
        typeId: event.currentTarget.dataset.typeId,
        typeName: event.currentTarget.dataset.typeName,
        page: 1,
        total: 0
      })
      this.initDigitalProduct()
    },
    gotoCountPrice(event) {
      let versionId = event.currentTarget.dataset.versionId
      if (versionId == null || versionId == '') {
        tips.ERROR_500()
      } else {
        wx.navigateTo({
          url: '/pages/placeordersteps/placeordersteps?versionId=' + versionId,
        })
      }
    },
    gotoDigitalList(event) {
      let brandId = event.currentTarget.dataset.brandId
      let typeId = this.data.typeId
      let typeName = this.data.typeName
      wx.navigateTo({
        url: `/pages/digitallist/digitallist?brandId=${brandId}&typeId=${typeId}&typeName=${typeName}`,
      })
    }
  },
  attached: function () {
    var that = this
    var clientInfo = wx.getSystemInfoSync()
    var windowHeight = clientInfo.windowHeight 
    if (clientInfo.model == "PAHM00" || clientInfo.model == "PAFM00" || clientInfo.model == "PAFT00") { 
      windowHeight = 680
    }
    try {
      let brandId = wx.getStorageSync("brandId");
      let the_type = wx.getStorageSync("the_type");
      if (brandId == null || brandId == '') {
        brandId = '85001ac13f7e4c56ab949328165e0ed6'
      }
      if (the_type == null || the_type == '') {
        the_type = 'phone'
      }
      that.setData({
        brandId: brandId,
        signClass: the_type,
        type: the_type, //@hbp
        domainName: domain.domain_qupingce,
        windowHeight: windowHeight < 555 ? 555 : windowHeight 
      })
    } catch (e) {
      tips.ERROR_500()
    }

    that.initMainProduct();

    wx.removeStorageSync("brandId") //把缓存里面的数据清空
    wx.removeStorageSync("the_type") //把缓存里面的数据清空@hbp
  }
})