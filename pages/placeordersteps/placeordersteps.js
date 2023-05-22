import {
  tips
} from '../../utils/tips'
import {
  commonDomain as domain
} from "../../constant/common"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    product_conflict: [],
    scrollTop: 0,
    //滚动条高度
    explainTitle: '',
    //示例图标题
    explainText: '',
    //示例图文本
    explainImg: null,
    //示例图片
    recycle_lowest_money: 0,
    product_title: {},
    //机型基本信息
    stepPercent: 0,
    //初始进度
    choseNum: 0,
    //初始选中
    featureLength: 0,
    scrollHeight: 0,
    //页面滚动高度
    ifShowBtn: false,
    //估价按钮显示
    dataTemps: {},
    //重新处理了原数据
    versionId: '',
    product_name: '',
    //机型名字
    features: [],
    //特征集合
    options: [],
    //选项集合
    feature_ids: [],
    //特征id数组
    features_options: {},
    //选项特征总和，取出的原数据
    isSelect: false,
    //选项是否被选中
    chosedfeatures: [],
    choseOptions: [],
    //
    current_id: '',
    //当前点击的id
    features_optionsEx: {} 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      versionId: options.versionId
    });
    this.getMainData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  onShow: function () {
    this.resetInfo();
  },
  resetInfo: function () {
    let it = this;
    wx.request({
      url: `${domain.domain_qupingce}/getAllVfoInfoForMain`,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // post请求需设置
      },
      data: {
        versionId: it.data.versionId,
        company: "jd"
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.status === 200) {
            let resData = res.data.data; //主数据
            resData[0].product_title.markup_money = parseInt(resData[0].product_title.markup_money);

            it.setData({
              product_title: resData[0].product_title //机器总体情况

            });
          } else {
            wx.showToast({
              title: '获取机型数据失败',
              icon: 'none',
              duration: 2000,
              mask: true
            });
          } // tips.ERROR_500()

        }
      },
      fail: function (err) {
        tips.ERROR_500();
      }
    });
  },
  sortObj: function (obj) {
    var arr = [];
    for (var i in obj) {
      arr.push([obj[i], i]);
    };
    arr.sort(function (a, b) {
      return a[0] - b[0];
    });
    var len = arr.length,
      obj = {};
    for (var i = 0; i < len; i++) {
      obj[arr[i][1]] = arr[i][0];
    }
    return obj;
  },
  tranformData: function (obj) {
    // console.log(obj)
    //lengths:特征总数
    let num = Object.keys(obj).length;
    let newObj = {}; 
    let basicArray = [],
      specialArray = [],
      otherArray = [],
      multiArray = [];
    for (var keyEx in obj) {
      let type = keyEx.split("|")[3]; //类型
      let index = parseInt(keyEx.split("|")[4]); //序号
      let objTemp = {};
      objTemp[keyEx] = obj[keyEx]; //保存当前循环对象
      switch (type) {
        case "basicSelect":
          basicArray[index] = objTemp;
          break;
        case "specialSelect":
          specialArray.push(objTemp); 
          break;
        case "otherSelect":
          otherArray[index] = objTemp;
          break;
        case "multiSelect":
          multiArray[index] = objTemp;
          break;
      }
    }
    basicArray = basicArray.filter(function (n) {
      return n
    });
    otherArray = otherArray.filter(function (n) {
      return n
    });
    multiArray = multiArray.filter(function (n) {
      return n
    });
    
    let sumArray = basicArray.concat(specialArray, otherArray, multiArray);

    for (let j = 0; j < sumArray.length; j++) {
      for (let keys in sumArray[j]) {
        newObj[keys] = sumArray[j][keys];
      }
    }
  
    return newObj;
  },
  getMainData: function () {
    let _this = this;

    let keys = [],
      temps = {},
      values = [],
      product_title,
      product_conflict = [],
      min_price,
      //price_area,
      type_name,
      features_options = {},
      features_optionsEx = {},
      recycle_lowest_money; 

    wx.request({
      url: `${domain.domain_qupingce}/getAllVfoInfoForMain`,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // post请求需设置
      },
      data: {
        versionId: _this.data.versionId,
        company: "jd"
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.status === 200) {
            let resData = res.data.data; //主数据
            //强制转换一次int类型
            resData[0].product_title.markup_money = parseInt(resData[0].product_title.markup_money);

            product_title = resData[0].product_title; //机器总体情况
            product_conflict = resData[1].product_conflictOption; 
            recycle_lowest_money = parseInt(product_title.recycle_lowest_money);
            type_name = product_title.type_name; 
            features_options = resData[2].product_info[0]; 
            //console.log(features_options)

            _this.setData({
              product_name: product_title.product_name,
              features_options: features_options,
              product_title: product_title,
              recycle_lowest_money: recycle_lowest_money,
              product_conflict: product_conflict
            }); 


            for (var p = 0; p < resData[2].product_info.length; p++) {
              for (var key in features_options) {
                keys.push(key);
                values.push(features_options[key]);

                _this.data.feature_ids.push(key.split('|')[1]);
              }
            }
            let features_optionsEx = _this.copyObj(features_options);
        
            for (let r = 0; r < keys.length; r++) {
              if (r > 0) {
                let deleteTemp = keys[r];
                delete features_optionsEx[deleteTemp];
              }
            } // 渲染


            _this.setData({
              //特征，选项赋值
              features: keys,
              options: values,
              features_optionsEx: features_optionsEx,
              featureLength: keys.length //初始化顶部进度的总步数

            });
       


            for (let k = 0; k < keys.length; k++) {
              let tempKey = keys[k].split('|')[1];
              let tempType = keys[k].split('|')[3];
              let tempValues = []; //临时数组

              for (let j = 0; j < values[k].length; j++) {
                let tempValuesEx = []; 

                tempValuesEx.push(values[k][j].option_id); // tempValuesEx.push(values[k][j].name);

                tempValuesEx.push(false); 

                tempValuesEx.push(tempType);
                tempValuesEx.push(values[k][j].isSpecial);
                tempValuesEx.push(values[k][j].name);
                tempValuesEx.push(keys[k].split('|')[0]);
                tempValuesEx.push(values[k][j].price);
                tempValuesEx.push(values[k][j].second_price);
                tempValuesEx.push(false); 
                //小数组push完毕，赋值

                tempValues.push(tempValuesEx); //临时数组push完毕，赋值

                temps[tempKey] = tempValues;
              }
            }

            _this.setData({
              dataTemps: temps
            });
            //console.log(temps)

          } else {
            wx.showToast({
              title: '获取机型数据失败',
              icon: 'none',
              duration: 2000,
              mask: true
            });
          } // tips.ERROR_500()

        }
      },
      fail: function (err) {
        tips.ERROR_500();
      }
    });
  },
  copyObj: function (obj) {
    var newobj = {};

    for (var attr in obj) {
      newobj[attr] = obj[attr];
    }

    return newobj;
  },

  /*点击按钮事件
   */
  optionPressFun: function (event) {

    this.choseFun(event); 

    this.showNextfeature(event); 

    this.showBtnFun(event); 

    this.scrollFun(event); 

    this.isConflictFun(event); 
  },


  choseFun: function (event) {

    let temps = this.data.dataTemps;
    let currentPressId = event.currentTarget.dataset.optionid,
      currentParentId = event.currentTarget.dataset.parentfeatureid; 

    let currentfeatureType = event.currentTarget.dataset.featuretype;

    for (let k = 0; k < temps[currentParentId].length; k++) {
      if (currentfeatureType != 'multiSelect') {
        temps[currentParentId][k][1] = false;
      } 


      if (currentPressId == temps[currentParentId][k][0] && currentfeatureType == 'multiSelect') {
        temps[currentParentId][k][1] = !temps[currentParentId][k][1];
      } else if (currentPressId == temps[currentParentId][k][0]) {
        temps[currentParentId][k][1] = true;
      }
    }

    this.setData({
      dataTemps: temps
    }); //console.log(this.data.choseOptions);
    //console.log(this.data.choseOptions);

    if (currentPressId == undefined) currentPressId = 'undefined';
    this.setData({
      current_id: currentPressId
    });

  },

  
  showNextfeature: function (event) {
    let temps = this.data.dataTemps;
    let features_options = this.data.features_options,
      features_optionsEx = this.data.features_optionsEx;

    let currentfeatureType = event.currentTarget.dataset.featuretype,
      currentoptionType = event.currentTarget.dataset.optiontype; 

    let currentPressId = event.currentTarget.dataset.optionid,
      currentParentId = event.currentTarget.dataset.parentfeatureid; //取出键和值

    let keys = this.data.features,
      values = this.data.options;

    if (currentoptionType == 'true') {
    
      for (let x = 0; x < keys.length; x++) {
        let tempfeatureType = keys[x].split("|")[3];

        if (tempfeatureType == 'otherSelect' || tempfeatureType == 'multiSelect') {
          let tempfeatureNew = keys[x];
          delete features_optionsEx[tempfeatureNew];
        }
      }

      for (let arry in temps) {
        for (let b = 0; b < temps[arry].length; b++) {
          if (temps[arry][b][2] == 'otherSelect' || temps[arry][b][2] == 'multiSelect') {
            temps[arry][b][1] = false;
          }
        }
      }

      this.setData({
        dataTemps: temps,
        features_optionsEx: features_optionsEx //ifShowBtn: true

      });
    } else {
      for (let p = 0; p < keys.length; p++) {
        let tempfeature = keys[p],
          tempfeatureId = keys[p].split("|")[1]; //keys中第p个特征id

        if (currentParentId == tempfeatureId) {
          let newP = p + 1,
            tempfeatureNew = keys[newP],
            addfeature = features_options[tempfeatureNew]; 

          features_optionsEx[tempfeatureNew] = addfeature; 
        }
      }

      this.setData({
        features_optionsEx: features_optionsEx
      });
    }
  },


  showBtnFun: function (event) {
    this.setData({
      ifShowBtn: false
    });
    let choseNum = 0,
      temps = this.data.dataTemps,
      stepPercent = 0,
      arrys = []; 

    for (let arry in temps) {
      for (let b = 0; b < temps[arry].length; b++) {
        if (temps[arry][b][1] == true) choseNum++; 

        if (temps[arry][b][2] == 'specialSelect' && temps[arry][b][1] == true && temps[arry][b][3] == 'true') {
          this.setData({
            ifShowBtn: true
          });
        }
      }

      arrys.push(arry);
    }

    if (choseNum > arrys.length - 2) {
      this.setData({
        ifShowBtn: true,
        featureLength: arrys.length
      });
    }


    if (choseNum > arrys.length) return; 

    stepPercent = choseNum / arrys.length * 100;
    this.setData({
      choseNum: choseNum,
      stepPercent: stepPercent
    });
  },
  scrollFun: function (event) {
    let _this = this;

    let position = event.currentTarget.dataset.position; //查询点击节点的高度位置信息

    const query = wx.createSelectorQuery();
    query.select("." + position + "").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function (res) {
      let kk = res[0].height * 8 + _this.data.scrollHeight;
      _this.setData({
        scrollHeight: kk
      }); //console.log("bootom:" + res[0].bottom + "-----height:" + res[0].height + "---top:" + res[0].top)

    }); 

    if (_this.data.choseNum >= _this.data.features.length) return; //console.log(_this.data.scrollHeight)

    _this.setData({
      scrollTop: 10000
    });
    wx.pageScrollTo({
      scrollTop: _this.data.scrollHeight,
      duration: 300
    })
    // console.log(_this.data.height)

  },
  isConflictFun: function (event) {
    // console.log(this.data.product_conflict);
    // console.log("choseNum:" + this.data.choseNum);
    // console.log(this.data.dataTemps);
    let product_conflict = this.data.product_conflict,
      tempDatas = this.data.dataTemps,
      choseNum = this.data.choseNum; 

    for (let aim in tempDatas) {
      for (let j = 0; j < tempDatas[aim].length; j++) {
        tempDatas[aim][j][8] = false;
      }
    }

    this.setData({
      dataTemps: tempDatas
    }); 

    for (let q = 0; q < product_conflict.length; q++) {
      let conflictOptions = product_conflict[q].conflict_optionStr;
      conflictOptions = conflictOptions.substring(0, conflictOptions.length - 1).split('|');

      for (let arry in tempDatas) {
        for (let x = 0; x < tempDatas[arry].length; x++) {
          if (tempDatas[arry][x][1] == true) {
            let choseText = tempDatas[arry][x][4];

            if (conflictOptions.indexOf(choseText) != -1) {
              conflictOptions.splice(conflictOptions.indexOf(choseText), 1);

              if (conflictOptions.length == 1) {
                for (let arryEx in tempDatas) {
                  for (let b = 0; b < tempDatas[arryEx].length; b++) {
                    if (tempDatas[arryEx][b][4] == conflictOptions) {
                      tempDatas[arryEx][b][8] = true;
                      tempDatas[arryEx][b][1] = false;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    this.setData({
      dataTemps: tempDatas
    });
  },

  toPricePage: function () {
    var that = this;
    let temps = that.data.dataTemps,
      keys = that.data.features,
      choseCount = 0,
      new_price,
      //picked price
      new_price_second,
      new_father_name,
      //picked feature name
      new_child_name,
      //picked option name
      new_name,
      area_sum1 = [],
      area_sum1_second = [],
      area_sum2 = [],
      area_sum3 = [],
      area_sum4 = [],
      Arry_price = [],
      //prices group
      Arry_name = []; //options group

    let max_price,
      price_area,
      min_price,
      product_name,
      take_price = 0,
      final_price,
      old_final_price = 0,
      priceRatio,
      single_price,
      overLowPrice = false;
    let arrayX = [], 

      global_markup_info = {},
      global_markup_money = 0, 
      //llq 2021-8-26

      //llq 2022.6.20 
      specialOption = false, //默认没选中
      jswg = 0, 
      pmwg = 0; 
    //llq 2022.6.20

    for (let arry in temps) {
      for (let y = 0; y < temps[arry].length; y++) {
        if (temps[arry][y][1]) {
          choseCount++;
          new_price = temps[arry][y][6];
          new_price_second = temps[arry][y][7];
          new_father_name = temps[arry][y][5];
          new_child_name = temps[arry][y][4]; 

          arrayX.push(temps[arry][y][0]);

          //2022.6.20llq
          if (temps[arry][y][0] == "44370bea01de45ef898a7ee23ed08532") { 
            specialOption = true;
          }
          if (temps[arry][y][5] == "机身外观") { 
            jswg = parseInt(temps[arry][y][6]);
          }
          if (temps[arry][y][5] == "屏幕外观") { 
            pmwg = parseInt(temps[arry][y][6]);
          }
          //2022.6.20llq

        
          if (new_child_name == "都不是，下一步") new_child_name = "无";
          new_name = '【' + new_father_name + "】" + ":" + new_child_name;
       
          if (choseCount > keys.length) {
            Arry_name[keys.length - 1] += ',' + new_child_name;
          } else {
            Arry_name.push(new_name);
          } //different area prices put in different prices group


          switch (temps[arry][y][2]) {
            case 'basicSelect':
              area_sum1.push(new_price);
              area_sum1_second.push(new_price_second);
              break;

            case 'specialSelect':
              area_sum2.push(new_price);
              break;

            case 'otherSelect':
              area_sum3.push(new_price);
              break;

            case 'multiSelect':
              area_sum4.push(new_price);
              break;
          }
        }
      }
    }

    area_sum1 = that.arrySum(area_sum1);
    area_sum1_second = that.arrySum(area_sum1_second);
    area_sum2 = that.arrySum(area_sum2);
    area_sum3 = that.arrySum(area_sum3);
    area_sum4 = that.arrySum(area_sum4);
    if (area_sum3 == undefined) area_sum3 = 0;
    if (area_sum4 == undefined) area_sum4 = 0;

    if (Arry_price.indexOf(undefined) != -1) {
      wx.showToast({
        title: '请您勾选完整后再估价',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      Arry_name = [];
      Arry_price = [];
      return;
    } // let storageAreaPrice = "" + area_sum1 + "|" + area_sum1_second + "|" + area_sum2 + "|" + area_sum3 + "|" + area_sum4;


    max_price = that.data.product_title.max_price;
    product_name = that.data.product_title.product_name;
    min_price = that.data.product_title.min_price;
    price_area = that.data.product_title.price_area.split('|');
    if (area_sum2 != 0) area_sum1 = area_sum1_second;
    priceRatio = 1 - area_sum1 / max_price;

    for (var i = 0; i < price_area.length; i++) {
      price_area[i] = parseInt(price_area[i]);
    } //count area4's price


    if (area_sum4 != undefined && area_sum4 != 0) {
      for (var u = 0; u < price_area.length + 1; u++) {
        if (u != price_area.length) {
          if (area_sum4 <= price_area[u]) {
            area_sum4 = price_area[u];
            break;
          }
        } else {
          //  area_sum4 = price_area[price_area.length-1];
          overLowPrice = true;
        }
      }
    }

    //2022.6.20count area3's price
    if (that.data.product_title.type_name == "phone" && specialOption && area_sum3 != undefined && area_sum3 != 0) {
      area_sum3 = area_sum3 - pmwg - jswg + parseInt(jswg) * 0.3
    } 
    //2022.6.20

    if (!overLowPrice) {
      final_price = Math.round(max_price - area_sum1 - priceRatio * (area_sum2 + area_sum3 + area_sum4));
    } else {
      final_price = Math.round(2 * priceRatio * min_price);
    }

    if (final_price <= min_price) final_price = Math.round(min_price + priceRatio * min_price);
    if (priceRatio < 0) final_price = min_price; // console.log(final_price);
    //处理加价券的情况

    let isNew = that.isNewFun(arrayX);
    let isLock = that.isLockFun(arrayX);

    wx.setStorage({
      key: 'is_new',
      data: isNew
    });

    //llq-------2021-8-25(查询是否有范围加价券)
    wx.request({
      url: `${domain.domain_qupingce}/findFWMarkUpRoll`,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // post请求需设置
      },
      data: {
        company: 'jd',
        money: final_price,
        versionId: that.data.versionId
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.status === 200) {
            if (res.data.data.newflag == 3 || res.data.data.newflag == 1 && isNew || res.data.data.newflag == 2 && !isNew) {
              global_markup_info = res.data.data;
              global_markup_money = parseInt(res.data.data.fmarkup_money);
            }
          } else {
            console.log("无范围加价券");
          }

          if ((that.data.product_title.ismarkup == 2 && isNew &&
              that.data.product_title.newFlag == 1) || (that.data.product_title.ismarkup == 2 && !isNew && that.data.product_title.newFlag == 2) ||
            (that.data.product_title.ismarkup == 2 && that.data.product_title.newFlag == 3)) {

            old_final_price = final_price; //存上老价格

            //判断是否有全局的加价券
            if (global_markup_money != 0) {

              final_price += global_markup_money;
              final_price += that.data.product_title.markup_money;

              //修改加价券相关信息
              that.data.product_title.markup_money = global_markup_money + that.data.product_title.markup_money; //更换加价券金额
              that.data.product_title.mrremark = "范围加价：" + global_markup_money + " ；机型加价：" + that.data.product_title.markup_money; //加价备注

            } else {
              //下单传老价格参数
              final_price += that.data.product_title.markup_money;
              that.data.product_title.mrremark = "机型加价：" + that.data.product_title.markup_money; //加价备注
            }

          } else {
            console.log("无机型加价券-");
            if (global_markup_money != 0) {
              old_final_price = final_price; //存上老价格
              final_price += global_markup_money;

              that.data.product_title.markup_id = global_markup_info.markup_id_fw; //更换加价券id
              that.data.product_title.markup_money = global_markup_money; //更换加价券金额
              that.data.product_title.mrremark = "范围加价：" + global_markup_money; //哪种类型的加价券
            } else {
              console.log("无机型，也无范围加价券");
              that.data.product_title.markup_id = "";
              that.data.product_title.markup_money = 0;
              that.data.product_title.mrremark = ""; //加价备注
            }

          }

          //低于最低价不回收
          if (!(final_price - that.data.product_title.markup_money > that.data.recycle_lowest_money)) {
            wx.showModal({
              title: '提示',
              content: '智能估价较低，可联系在线客服，说明机况进行人工报价哦~',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  //  console.log('确定')
                } else if (res.cancel) {
                  // console.log('取消')
                }
              }
            })
            return;
          }

          if (isLock & that.data.product_title.type_name == "phone" & that.data.product_title.brand_name == "苹果" & that.data.product_title.lock_money > 0) {

            final_price += that.data.product_title.lock_money;

            //修改加价券相关信息
            that.data.product_title.markup_id = that.data.product_title.version_id; //存机型id
            that.data.product_title.markup_money += that.data.product_title.lock_money; //更换加价券金额
            that.data.product_title.mrremark += " iphone有锁机加价：" + that.data.product_title.lock_money;

          }


          wx.setStorage({
            key: 'final_price',
            data: final_price
          }); 
          wx.setStorage({
            key: 'old_final_price',
            data: old_final_price
          }); 

          wx.setStorage({
            key: 'Arry_name',
            data: Arry_name
          }); 

          wx.setStorage({
            key: 'product_title',
            data: that.data.product_title
          });
          wx.setStorage({
            key: 'versionId',
            data: that.data.versionId
          });
          wx.setStorage({
            key: 'isDigital',
            data: false
          });

          wx.navigateTo({
            url: '/pages/showcountprice/showcountprice'
          });

        } else {

          wx.showToast({
            title: "系统忙碌，请稍后重试~",
            icon: 'none',
            duration: 2000,
            mask: false
          });

        }
      }
    })
    //llq-------2021-8-25(查询是否有范围加价券)

  },
  isNewFun: function (arrays) {
    let temp = this.data.features_options; 

    for (let key in temp) {
      for (let y = 0; y < temp[key].length; y++) {
        if (temp[key][y].isNew == 1) {
          if (arrays.indexOf(temp[key][y].option_id) != -1) {

            return true;
          }
        }
      }
    }
    return false;
  },


  isLockFun: function (arrays) {
    let temp = this.data.features_options; //所有选项合集

    for (let key in temp) {
      for (let y = 0; y < temp[key].length; y++) {
        if (temp[key][y].name.trim() == "水货有锁") {
          if (arrays.indexOf(temp[key][y].option_id) != -1) {
            return true;
          }
        }
      }
    }
    console.log('没有选到有锁');
    return false;
  },

  //求和方法
  arrySum: function (arr) {
    var s = 0;
    arr.forEach(function (val, idx, arr) {
      s += val;
    }, 0);
    return s;
  },

  /**
   * 弹出层函数
   * 弹出示例图的函数
   */
  //弹出事件
  showExplain: function (e) {
    // let _this = this;
    var titleName = e.currentTarget.dataset.titlename;
    var explainParams = {
      versionId: this.data.versionId,
      id: e.currentTarget.dataset.showid,
      featureOrOption: e.currentTarget.dataset.showtype,
      brandId: this.data.product_title.brand_id,
      typeId: this.data.product_title.type_id
    };
    this.setData({
      showModal: true
    });
    this.getExplainData(explainParams, titleName);
  },
  preventTouchMove: function () { 
  },
  closeModal: function () {
    this.setData({
      showModal: false
    });
  },

  /**
   * 弹出层函数end
   */
  getExplainData: function (explainParams, titleName) {
    let the = this;
    wx.request({
      url: `${domain.domain_qupingce}/getFOImgWordsDetail`,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // post请求需设置
      },
      data: explainParams,
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.status === 200) {
            console.log(res);
            the.setData({
              explainTitle: titleName,
              //示例图标题
              explainText: res.data.data.wordsDetail,
              //示例图文本
              explainImg: `${domain.domain_qupingce}` + res.data.data.imgDetail
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              mask: false
            });
          }
        } else {
          wx.showToast({
            title: '获取示例图出错，请联系客服',
            icon: 'none',
            duration: 2000,
            mask: false
          });
        }
      }
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
});