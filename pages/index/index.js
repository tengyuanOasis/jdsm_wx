import {
  tips
} from "../../utils/tips"
import {
  MainIndexModel
} from "../../model/mainindex"
import {
  commonDomain as domain
} from '../../constant/common'
var mainIndexModel = new MainIndexModel();
const Models = require('../../utils/modelList.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    phoneName: null, //机型识别的名字
    versionId: '', //识别出来机型的id，用于跳转页面

    //前5个品牌
    brandList: [],
    domainName: domain.domain_qupingce,
    versionImg: '/images/test-phone.png', //识别出来的机型的图片
    much_money: 0,
    isShowEditModel: false
  },
  onLoad: function () {
    this.initFiveBrands();
  },
  onShow: function () {
    this.getSystemInfo();
  },
  onShareAppMessage: function (res) {
    //自定义转发
    return {
      title: '尖端数码回收',
      path: 'pages/index/index',
      imageUrl: '/images/share_img.jpg'
    }
  },
  onPullDownRefresh: function () { //首页下拉刷新事件
    this.getSystemInfo();
    wx.navigateTo({
      url: '/' + this.route
    })
    wx.stopPullDownRefresh();
  },

  getSystemInfo: function () {
    let it = this;
    let modelTemp = Models.appleModel;
    let tempObj = {};
    /* 统一转小写 */
    for (let key in modelTemp) {
      let value_ = modelTemp[key].toLowerCase()
      let key_ = key.toLowerCase();
      tempObj[key_] = value_;
    }
    modelTemp = tempObj;
    wx.getSystemInfo({
      success(res) {
        let model = res.model;
        model = model.toLowerCase();
        model = model.substring(model.indexOf('<') + 1, model.indexOf('>')).replace(/\s+/g, "");
        let commonName = modelTemp[model];
        //用转换后的名字去对比数据库
        if (commonName) it.searchByName(commonName);
      }
    })
  },
  searchByName: function (key) {
    let it = this;
    wx.request({
      url: `${domain.domain_qupingce}/search/serarchByKey`,
      data: {
        key: key
      },
      method: "GET", 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.statusCode == '200') { //请求状态码
          if (res.data.status == '200') { //后台返回成功状态码
            let datas = res.data.data;

            let newArray = [];
            for (let t = 0; t < datas.length; t++) {
              let obj = {
                name: '',
                id: '',
              }
              obj.normal_name = datas[t].version_name;
              obj.name = datas[t].version_name.toLowerCase().replace(/\s+/g, "");
              obj.id = datas[t].version_id;
              obj.title_img = datas[t].title_img;
              obj.much_money = datas[t].much_money;
              newArray.push(obj);
            }
            //用新建的数组来循环对比当前机型
            let formatKey = key.toLowerCase().replace(/\s+/g, ""); //当前机型也格式化一下,方便对比
            for (let v = 0; v < newArray.length; v++) {
              if (newArray[v].name == formatKey) {
                it.setData({
                  phoneName: newArray[v].normal_name,
                  versionId: newArray[v].id,
                  versionImg: it.data.domainName + "/GetFile/getUploadImg?fileName=" + newArray[v].title_img,
                  much_money: newArray[v].much_money
                })
                //只允许一个结果，找到就停止
                return;
              }
            }

          }
        }
      }
    })
  },
  //获取品牌
  initFiveBrands: function () {
    let _this = this;
    wx.request({
      url: `${domain.domain_qupingce}/page/getAllBrandByType`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        type: "phone"
      },
      success: function (res) {
        if (res.statusCode === 200) {
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
    })
  },
  toCommonProblem: function () {
    wx.navigateTo({
      url: '/pages/questionguide/questionguide'
    });
  },
  toKeySearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },
  toCategoryFun: function (e) {
    wx.setStorageSync('brandId', e.currentTarget.dataset.brandId);
    wx.setStorageSync('the_type', 'phone');

    wx.reLaunch({
      url: '/pages/category/category'
    });
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


})