<template>
    <view style="height: 100%">
        <!-- 顶部大标题组件 -->
        <header-cmp :isShow="false">
            <view slot="question">
                <text class="topTitleName">{{ product_name }}{{ bbb[1] }}</text>
            </view>
        </header-cmp>
        <!-- /顶部大标题组件 -->
        <view class="container">
            <view class="step-line" style="">当前进度{{ choseNum }}/{{ featureLength }}</view>
            <view class="step-line-bg" :style="'width:' + stepPercent + '%;'"></view>
            <scroll-view scroll-y :scroll-with-animation="true" :scroll-top="scrollTop" class="info-list">
                <view class="single-info" v-for="(Mitem, M) in features_optionsEx" :key="M">
                    <view :id="Mitem[0].price" class="title-line">
                        <view class="count-title-left">
                            <image src="/static/images/yj.png" style="width: 10rpx; height: 36rpx; margin-right: 20rpx"></image>
                            <view class="feature-name">{{ Tool.backStr(M, 0) }}</view>
                        </view>
                        <block v-if="Tool.backStr(M, 2) == 'true'">
                            <image
                                @tap.stop.prevent="showExplain"
                                :data-titlename="Tool.backStr(M, 0)"
                                data-showtype="feature"
                                :data-showid="Tool.backStr(M, 1)"
                                class="qst-btn"
                                src="/static/images/ask3.png"
                            ></image>
                        </block>
                    </view>

                    <view class="feature-child-box">
                        <view
                            @tap="optionPressFun"
                            :data-price="Nitem.price"
                            :data-optionid="Nitem.option_id"
                            :data-featuretype="Tool.backStr(M, 3)"
                            :data-optiontype="Nitem.isSpecial"
                            :class="'abc' + N + ' feature-child ' + (dataTemps[Tool.backStr(M, 1)][N][1] ? 'count-select' : '')"
                            :data-isselect="isSelect"
                            :data-position="'abc' + N"
                            :data-parentfeatureid="Tool.backStr(M, 1)"
                            v-for="(Nitem, N) in features_optionsEx[M]"
                            :key="N"
                        >
                            {{ Nitem.name }}

                            <image
                                v-if="Nitem.hasDetail"
                                :data-titlename="Nitem.name"
                                data-showtype="option"
                                :data-showid="Nitem.option_id"
                                @tap.stop.prevent="showExplain"
                                class="child-qst-btn"
                                src="/static/images/ask3.png"
                            ></image>
                        </view>
                    </view>
                </view>
                <button v-if="ifShowBtn" @tap="toPricePage" class="count_btn" size="default" type="button" :plain="false" primarySize="default">立即估价</button>
                <view class="blankBlock">这是一个透明标签用来占位</view>
            </scroll-view>
            <view @tap="closeModal" class="mask" @TouchMove.stop.prevent="preventTouchMove" v-if="showModal"></view>
            <view class="modalBox" v-if="showModal">
                <view class="myModal-title">{{ explainTitle }}</view>
                <image @tap="closeModal" mode="aspectFit" class="outImg" src="/static/pages/digitalordersteps/images/out.png" />
                <image mode="widthFix" class="demoImg" :src="explainImg" />
                <text class="explain">{{ explainText }}</text>
            </view>
        </view>

        <kefu-cmp></kefu-cmp>
    </view>
</template>
<script module="Tool" lang="wxs">
//字符串取值>>Tool.cutStr():val传入字符串，position切割的位置
var cutStr = function(val, position) {
  return val.split('|')[position];
}
module.exports = {
  backStr: cutStr
}
</script>


<script>
import headerCmp from '@/components/header/header';
import { tips } from '../../utils/tips';
import { commonDomain as domain } from '../../constant/common';
export default {
    components: {
        headerCmp,
    },
    data() {
        return {
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

            isSelect: false,
            chosedfeatures: [],
            choseOptions: [],

            //
            current_id: '',

            //当前点击的id
            features_optionsEx: {},

            scrollTop: 0,
            showModal: false,
            M: '',
            price: '',

            Nitem: {
                price: '',
                option_id: '',
                isSpecial: '',
                hasDetail: '',
                name: ''
            },

            N: ''
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            //上一个页面传递过来的versionId
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
    onPullDownRefresh: function () {
        uni.stopPullDownRefresh();
    },
    methods: {
        resetInfo: function () {
            let that = this;
            uni.request({
                url: `${domain.domain_qupingce}/getAllVfoInfoForMain`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // post请求需设置
                },

                data: {
                    versionId: that.versionId,
                    company: 'jd'
                },
                method: 'post',
                success: function (res) {
                    //if (res.statusCode === 200) {
                    if (res.data.status === 200) {
                        let resData = res.data.data; //主数据
                        //强制转换一次int类型
                        resData[0].product_title.markup_money = parseInt(resData[0].product_title.markup_money);
                        //console.log(resData)

                        that.setData({
                            product_title: resData[0].product_title //机器总体情况
                        });
                    } else {
                        uni.showToast({
                            title: '获取机型数据失败',
                            icon: 'none',
                            duration: 2000,
                            mask: true
                        });
                    } // tips.ERROR_500()

                    //  }
                },

                fail: function (err) {
                    tips.ERROR_500();
                }
            });
        },

        getMainData: function () {
            let that = this;
            let keys = [];
            let temps = {};
            let values = [];
            let product_title;
            let product_conflict = [];
            let min_price;
            let //price_area,
                type_name;
            let features_options = {};
            let recycle_lowest_money; //最低回收价
            //取出估价信息
            uni.request({
                url: `${domain.domain_qupingce}/getAllVfoInfoForDigital`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // post请求需设置
                },

                data: {
                    versionId: that.versionId,
                    company: 'jd'
                },
                method: 'post',
                dataType: 'json',
                success: function (res) {
                    // if (res.statusCode === 200) {
                    if (res.data.status === 200) {
                        let resData = res.data.data; //主数据
                        //强制转换一次int类型
                        resData[0].product_title.markup_money = parseInt(resData[0].product_title.markup_money);
                        console.log(resData);
                        product_title = resData[0].product_title;
                        product_conflict = resData[1].product_conflictOption;
                        recycle_lowest_money = parseInt(product_title.recycle_lowest_money);
                        type_name = product_title.type_name;
                        features_options = resData[2].product_info[0];
                        that.setData({
                            product_name: product_title.product_name,
                            features_options: features_options,
                            product_title: product_title,
                            recycle_lowest_money: recycle_lowest_money
                        });
                        for (var p = 0; p < resData[2].product_info.length; p++) {
                            for (var key in features_options) {
                                keys.push(key);
                                values.push(features_options[key]);
                                that.feature_ids.push(key.split('|')[1]);
                            }
                        }
                        let features_optionsEx = that.copyObj(features_options); // let features_optionsEx = _this.data.features_optionsTemp;

                        for (let r = 0; r < keys.length; r++) {
                            if (r > 0) {
                                let deleteTemp = keys[r];
                                delete features_optionsEx[deleteTemp];
                            }
                        } // 渲染

                        that.setData({
                            //特征，选项赋值
                            features: keys,
                            options: values,
                            features_optionsEx: features_optionsEx,
                            featureLength: keys.length //初始化顶部进度的总步数
                        }); // console.log(_this.data.features_options)
                        //console.log(values);

                        /*非常重要！！！---------下面生成决定页面所有效果的对象dataTemps--------
            -----------------
             */

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
                                tempValues.push(tempValuesEx); //临时数组push完毕，赋值

                                temps[tempKey] = tempValues;
                            }
                        }
                        that.setData({
                            dataTemps: temps
                        }); //console.log(temps)
                    } else {
                        uni.showToast({
                            title: '获取机型数据失败',
                            icon: 'none',
                            duration: 2000,
                            mask: true
                        });
                    } // tips.ERROR_500()

                    //}
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
        },

        choseFun: function (event) {
            let temps = this.dataTemps; //console.log(temps);
            let currentPressId = event.currentTarget.dataset.optionid;
            let currentParentId = event.currentTarget.dataset.parentfeatureid;
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
            });
            if (currentPressId == undefined) {
                currentPressId = 'undefined';
            }
            this.setData({
                current_id: currentPressId
            });
        },

        showNextfeature: function (event) {
            let temps = this.dataTemps;
            let features_options = this.features_options;
            let features_optionsEx = this.features_optionsEx;
            let currentfeatureType = event.currentTarget.dataset.featuretype;
            let currentoptionType = event.currentTarget.dataset.optiontype;
            let currentPressId = event.currentTarget.dataset.optionid;
            let currentParentId = event.currentTarget.dataset.parentfeatureid;
            let keys = this.features;
            let values = this.options;
            if (currentoptionType == 'true') {
                for (let x = 0; x < keys.length; x++) {
                    let tempfeatureType = keys[x].split('|')[3];
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
                    let tempfeature = keys[p];
                    let tempfeatureId = keys[p].split('|')[1]; //keys中第p个特征id
                    if (currentParentId == tempfeatureId) {
                        let newP = p + 1;
                        let tempfeatureNew = keys[newP];
                        let addfeature = features_options[tempfeatureNew];
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
            let choseNum = 0;
            let temps = this.dataTemps;
            let stepPercent = 0;
            let arrys = [];
            let exist_multiSelect = false; //console.log('1');
            //console.log(temps);
            for (let arry in temps) {
                for (let b = 0; b < temps[arry].length; b++) {
                    if (temps[arry][b][2] == 'multiSelect') {
                        exist_multiSelect = true;
                    }
                    if (temps[arry][b][1] == true) {
                        choseNum++;
                    }
                    if (temps[arry][b][2] == 'specialSelect' && temps[arry][b][1] == true && temps[arry][b][3] == 'true') {
                        this.setData({
                            ifShowBtn: true
                        });
                    }
                }
                arrys.push(arry);
            }
            if (exist_multiSelect) {
                if (choseNum > arrys.length - 2) {
                    this.setData({
                        ifShowBtn: true,
                        featureLength: arrys.length
                    });
                }
            } else {
                if (choseNum > arrys.length - 1) {
                    this.setData({
                        ifShowBtn: true,
                        featureLength: arrys.length
                    });
                }
            }
            if (choseNum > arrys.length) {
                return;
            }
            stepPercent = (choseNum / arrys.length) * 100;
            this.setData({
                choseNum: choseNum,
                stepPercent: stepPercent
            });
        },

        scrollFun: function (event) {
            let that = this;
            let position = event.currentTarget.dataset.position;
            const query = uni.createSelectorQuery();
            query.select('.' + position + '').boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec(function (res) {
                let kk = res[0].height * 8 + that.scrollHeight;
                that.setData({
                    scrollHeight: kk
                }); //console.log("bootom:" + res[0].bottom + "-----height:" + res[0].height + "---top:" + res[0].top)
            });

            if (that.choseNum >= that.features.length) {
                return;
            } // console.log(_this.data.scrollHeight)

            that.setData({
                scrollTop: 10000
            });
            uni.pageScrollTo({
                scrollTop: that.scrollHeight,
                duration: 300
            });
            // console.log(_this.data.height)
        },

        toPricePage: function () {
            var that = this;
            let temps = that.dataTemps;
            let keys = that.features;
            let choseCount = 0;
            let new_price;
            let //picked price
                new_price_second;
            let new_father_name;
            let //picked feature name
                new_child_name;
            let //picked option name
                new_name;
            let //拼接上new_father_name+new_child_name
                // area_sum1 = [],
                // area_sum1_second = [],
                area_sum2 = [];
            let area_sum3 = [];
            let area_sum4 = [];
            let Arry_price = [];
            let //prices group
                Arry_name = []; //options group
            // 以下估价相关参数
            let max_price;
            let price_area;
            let min_price;
            let product_name;
            let final_price;
            let old_final_price = 0;
            let //  priceRatio,
                single_price;
            let overLowPrice = false;
            let arrayX = [];
            let global_markup_info = {};
            let global_markup_money = 0; //llq 2021-8-26
            for (let arry in temps) {
                for (let y = 0; y < temps[arry].length; y++) {
                    if (temps[arry][y][1]) {
                        choseCount++;
                        new_price = temps[arry][y][6];
                        new_price_second = temps[arry][y][7];
                        new_father_name = temps[arry][y][5];
                        new_child_name = temps[arry][y][4];
                        arrayX.push(temps[arry][y][0]);
                        if (new_child_name == '都不是，下一步') {
                            new_child_name = '无';
                        }
                        new_name = '【' + new_father_name + '】' + ':' + new_child_name;
                        if (choseCount > keys.length) {
                            Arry_name[keys.length - 1] += ',' + new_child_name;
                        } else {
                            Arry_name.push(new_name);
                        } //different area prices put in different prices group

                        switch (temps[arry][y][2]) {
                            // case 'basicSelect':
                            //   area_sum1.push(new_price);
                            //   area_sum1_second.push(new_price_second);
                            //   break;
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
            } // area_sum1 = that.arrySum(area_sum1);
            // area_sum1_second = that.arrySum(area_sum1_second);

            area_sum2 = that.arrySum(area_sum2);
            area_sum3 = that.arrySum(area_sum3);
            area_sum4 = that.arrySum(area_sum4);
            if (area_sum3 == undefined) {
                area_sum3 = 0;
            }
            if (area_sum4 == undefined) {
                area_sum4 = 0;
            }
            if (Arry_price.indexOf(undefined) != -1) {
                uni.showToast({
                    title: '请您勾选完整后再估价',
                    icon: 'none',
                    duration: 2000,
                    mask: true
                });
                Arry_name = [];
                Arry_price = [];
                return;
            } // let storageAreaPrice = "" + area_sum1 + "|" + area_sum1_second + "|" + area_sum2 + "|" + area_sum3 + "|" + area_sum4;

            max_price = that.product_title.max_price;
            product_name = that.product_title.product_name;
            min_price = that.product_title.min_price;
            price_area = that.product_title.price_area.split('|'); //if (area_sum2 != 0) area_sum1 = area_sum1_second;
            // priceRatio = 1 - (area_sum1 / max_price);

            for (var i = 0; i < price_area.length; i++) {
                price_area[i] = parseInt(price_area[i]);
            } //count area4's price

            if (area_sum4 != undefined && area_sum4 != 0) {
                if (that.product_title.price_area != 'null') {
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
            }
            if (!overLowPrice) {
                final_price = Math.round(max_price - area_sum2 - area_sum3 - area_sum4);
            } else {
                final_price = Math.round(min_price);
            }
            if (final_price <= min_price) {
                final_price = Math.round(min_price);
            } //if (priceRatio < 0) final_price = min_price;

            let isNew = that.isNewFun(arrayX);
            uni.setStorage({
                key: 'is_new',
                data: isNew
            });
            uni.request({
                url: `${domain.domain_qupingce}/findFWMarkUpRoll`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // post请求需设置
                },

                data: {
                    company: 'jd',
                    money: final_price,
                    versionId: that.versionId
                },
                dataType: 'json',
                method: 'post',
                success: function (res) {
                    if (res.statusCode === 200) {
                        if (res.data.status === 200) {
                            if (res.data.data.newflag == 3 || (res.data.data.newflag == 1 && isNew) || (res.data.data.newflag == 2 && !isNew)) {
                                global_markup_info = res.data.data;
                                global_markup_money = parseInt(res.data.data.fmarkup_money);
                            }
                        }
                        if (
                            (that.product_title.ismarkup == 2 && isNew && that.product_title.newFlag == 1) ||
                            (that.product_title.ismarkup == 2 && !isNew && that.product_title.newFlag == 2) ||
                            (that.product_title.ismarkup == 2 && that.product_title.newFlag == 3)
                        ) {
                            old_final_price = final_price;
                            if (global_markup_money != 0) {
                                final_price += global_markup_money;
                                final_price += that.product_title.markup_money;
                                that.product_title.markup_money = global_markup_money + that.product_title.markup_money;
                                that.product_title.mrremark = '范围加价：' + global_markup_money + ' ；机型加价：' + that.product_title.markup_money;
                            } else {
                                //下单传老价格参数
                                final_price += that.product_title.markup_money;
                                that.product_title.mrremark = '机型加价' + that.product_title.markup_money;
                            }
                        } else {
                            console.log('无机型加价券-');
                            if (global_markup_money != 0) {
                                old_final_price = final_price; //存上老价格
                                final_price += global_markup_money;
                                that.product_title.markup_id = global_markup_info.markup_id_fw; //更换加价券id
                                that.product_title.markup_money = global_markup_money; //更换加价券金额
                                that.product_title.mrremark = '范围加价：' + global_markup_money; //哪种类型的加价券
                            } else {
                                that.product_title.markup_money = 0;
                            }
                        }
                        if (!(final_price - that.product_title.markup_money > that.recycle_lowest_money)) {
                            uni.showModal({
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
                            });
                            return;
                        } //存价格

                        uni.setStorage({
                            key: 'final_price',
                            data: final_price
                        });
                        uni.setStorage({
                            key: 'old_final_price',
                            data: old_final_price
                        });
                        uni.setStorage({
                            key: 'Arry_name',
                            data: Arry_name
                        });
                        uni.setStorage({
                            key: 'product_title',
                            data: that.product_title
                        });
                        uni.setStorage({
                            key: 'versionId',
                            data: that.versionId
                        });
                        uni.setStorage({
                            key: 'isDigital',
                            data: true
                        });
                        uni.navigateTo({
                            url: '/pages/showcountprice/showcountprice'
                        });
                    } else {
                        uni.showToast({
                            title: '系统忙碌，请稍后重试~',
                            icon: 'none',
                            duration: 2000,
                            mask: false
                        });
                    }
                }
            });
            //llq-------2021-8-25(查询是否有范围加价券)
        },

        isNewFun: function (arrays) {
            let temp = this.features_options;
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

        arrySum: function (arr) {
            var s = 0;
            arr.forEach(function (val, idx, arr) {
                s += val;
            }, 0);
            return s;
        },

        showExplain: function (e) {
            console.log(666);
            // let _this = this;
            var titleName = e.currentTarget.dataset.titlename;
            var explainParams = {
                versionId: this.versionId,
                id: e.currentTarget.dataset.showid,
                featureOrOption: e.currentTarget.dataset.showtype,
                brandId: this.product_title.brand_id,
                typeId: this.product_title.type_id
            };
            this.setData({
                showModal: true
            });
            this.getExplainData(explainParams, titleName);
        },

        preventTouchMove: function () {},

        closeModal: function () {
            this.setData({
                showModal: false
            });
        },

        getExplainData: function (explainParams, titleName) {
            let that = this;
            uni.request({
                url: `${domain.domain_qupingce}/getFOImgWordsDetail`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // post请求需设置
                },

                data: explainParams,
                method: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (res.statusCode === 200) {
                        if (res.data.status === 200) {
                            console.log(res);
                            that.setData({
                                explainTitle: titleName,
                                //示例图标题
                                explainText: res.data.data.wordsDetail,
                                //示例图文本
                                explainImg: `${domain.domain_qupingce}` + res.data.data.imgDetail
                            });
                        } else {
                            uni.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000,
                                mask: false
                            });
                        }
                    } else {
                        uni.showToast({
                            title: '获取示例图出错，请联系客服',
                            icon: 'none',
                            duration: 2000,
                            mask: false
                        });
                    }
                }
            });
        }
    }
};
</script>
<style>
page {
    background: white;
}
.container {
    width: 100%;
    /* height: 300rpx; */
    margin-top: 100rpx;
    background-color: rgb(255, 255, 255);
}

.info-list {
    /* background-color: rgb(16, 163, 119); */
    height: 100%;
}

.blankBlock {
    height: 50px;
    color: white;
    background-color: rgb(240, 240, 240);
    opacity: 0.1;
}

.title-line {
    margin-left: 5%;
    width: 90%;
    color: #000;
    margin-top: 40rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.single-info:first-child {
    margin-top: 80rpx;
}

.count-title-left {
    display: flex;
    width: auto;
    flex-direction: row;
    align-items: center;
}

.feature-name {
    font-size: 34rpx;
    font-weight: bold;
}

.press-tips {
    font-size: 24rpx;
    color: #ffb632;
}

.qst-btn {
    width: 40rpx;
    height: 40rpx;
}

.child-qst-btn {
    position: absolute;
    bottom: 1rpx;
    right: 1rpx;
    width: 25rpx;
    height: 25rpx;
    padding: 5rpx;
}

.feature-child-box {
    text-align: center;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 10rpx;
    height: auto;
    flex-wrap: wrap;
    word-wrap: break-word;
    /* box-shadow: 0px 2rpx 6rpx #f1f1f1; */
    width: 90%;
    margin: auto;
}

.feature-child {
    font-weight: normal;
    color: #666;
    padding-top: 20rpx;
    padding-bottom: 20rpx;
    /* padding-left: 10rpx;
  padding-right: 10rpx; */
    text-align: left;
    display: block;
    background-color: #f8f8f8;
    width: 100%;
    margin-top: 20rpx;
    overflow: hidden;
    position: relative;
    font-size: 25rpx;
    border-radius: 15rpx;
}

.count_btn {
    margin-top: 60rpx;
    margin-left: 15%;
    padding: 25rpx;
    height: auto;
    background-image: linear-gradient(90deg, #89c7f9, #4ba7ec);
    color: white;
    font-size: 30rpx;
    width: 70%;
    border-radius: 40rpx;
}

.count-select {
    /* border: 1rpx solid #40AE87; */
    background: #e4e6f1;
}

.topTitleName {
    font-weight: bolder;
}

.hiden-Ele {
    display: none;
}

.step-line {
    width: 100%;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    /* padding: 5rpx !important; */
    position: fixed !important;
    font-size: 24rpx;
    z-index: 99;
    margin-top: 8rpx;
}

.step-line-bg {
    left: 0;
    right: 0;
    max-width: 768px;
    /* margin: 0 auto; */
    background-image: linear-gradient(90deg, #4ba7ec, #d098ff);
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 96;
    height: 35rpx;
    position: fixed !important;
    /* border-radius: 0 12px 12px 0; */
    padding-top: 3rpx;
    padding-bottom: 3rpx;
}

/* 弹出层样式------------------ */

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    z-index: 9000;
    opacity: 0.7;
}

.modalBox {
    width: 630rpx;
    height: 670rpx;
    position: fixed;
    top: 50%;
    left: 0;
    z-index: 9999;
    margin: -345rpx 60rpx;
    background-color: #fff;
    /* border-radius: 30rpx; */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.demoImg {
    width: 550rpx;
    /* height: 450rpx; */
    margin-top: 80rpx;
}

.outImg {
    width: 50rpx;
    height: 50rpx;
    position: absolute;
    right: -15rpx;
    top: -15rpx;
}

.myModal-title {
    padding-top: 32rpx;
    font-size: 30rpx;
    position: relative;
    height: 80rpx;
    width: 100%;
    background-color: #89c7f9;
    text-align: center;
    font-weight: bold;
    color: white;
}

.closeModalBtn {
    margin-top: 50rpx;
    color: rgb(252, 145, 83);
    font-size: 30rpx;
}

.explain {
    font-size: 26rpx;
    padding: 15rpx;
    color: rgb(143, 115, 76);
    padding-top: 30rpx;
}

/* /弹出层样式------------------ */
</style>
