<template>
    <view style="height: 100%">
        <view class="container-online-send">
            <!-- 订单信息 -->
            <view class="order-has">
                <!-- 1 -->
                <view class="order-title1">
                    <!-- 订单号 -->
                    <view class="order-number">
                        <text>订单号：</text>
                        <text class="text-number">{{ orderInfo.order_number }}</text>
                    </view>
                </view>
                <!-- 2 -->
                <view class="order-main">
                    <!-- 机器图片 -->
                    <image :src="domain + orderInfo.img"></image>
                    <!-- 机器简介 -->
                    <view class="version-intro">
                        <view class="version-title">
                            <text>{{ orderInfo.version_name }}</text>
                        </view>

                        <view class="order-other" v-if="orderInfo.secondary_recycle != 0">
                            <text class="order-other-3">二次报价：</text>
                            <text class="order-other-2">￥</text>
                            <text class="order-other-1">{{ orderInfo.secondary_recycle }}.'00'</text>
                        </view>
                        <view class="order-other" v-else>
                            <text class="order-other-3">回收价：</text>
                            <text class="order-other-2">￥</text>
                            <text class="order-other-1">{{ orderInfo.recycle_money }}.'00'</text>
                        </view>
                    </view>
                </view>
                <view class="order-button">
                    <view data-url="orderdetails/orderdetail" :data-order="orderInfo" class="order-button-deatil button-view" @tap="toOrderDetail">查看详情</view>
                </view>
            </view>
            <form @submit="formSubmit">
                <view class="formClass">
                    <view>
                        <view class="j-contact">
                            <!-- WX2MY: 属性space不被支持，请调整 -->
                            <text space="ensp">联系人：</text>
                            <input type="text" placeholder="输入联系人" name="j_contact" />
                        </view>
                        <view class="j-phone">
                            <!-- WX2MY: 属性space不被支持，请调整 -->
                            <text space="ensp">手机号码：</text>
                            <input type="text" name="j_phone" :disabled="false" :value="phoneNumber" />
                        </view>
                        <view class="j-province-city-county">
                            <text space="ensp">您所在地区：</text>
                            <region-picker @change="bindRegionChange" :value="region">
                                <view class="picker" v-if="region.length > 0">
                                    <text>{{ region[0] }}>{{ region[1] }}>{{ region[2] }}</text>
                                    <input type="text" name="j_province_city_county" :value="region[0] + '|' + region[1] + '|' + region[2]" style="display: none" />
                                </view>

                                <view class="picker" v-else>
                                    <text>省>市>区</text>
                                    <input type="text" name="j_province_city_county" value="" style="display: none" />
                                </view>
                            </region-picker>
                        </view>
                        <view class="j-address">
                            <!-- WX2MY: 属性space不被支持，请调整 -->
                            <text space="ensp">详细地址：</text>
                            <input type="text" name="j_address" placeholder="输入你所在的详细地址" />
                        </view>
                        <view class="sendstarttime">
                            <input
                                type="text"
                                name="sendstarttime"
                                style="display: none"
                                :value="
                                    dateTimeArray[0][dateTime[0]] +
                                    '-' +
                                    dateTimeArray[1][dateTime[1]] +
                                    '-' +
                                    dateTimeArray[2][dateTime[2]] +
                                    ' ' +
                                    dateTimeArray[3][dateTime[3]] +
                                    ':' +
                                    dateTimeArray[4][dateTime[4]] +
                                    ':00'
                                "
                            />
                            <!-- WX2MY: 属性space不被支持，请调整 -->
                            <text space="ensp">取件时间：</text>
                            <picker mode="multiSelector" :value="dateTime" @change="changeDateTime" @columnchange="changeDateTimeColumn" :range="dateTimeArray">
                                <view class="date-picker">
                                    {{ dateTimeArray[0][dateTime[0]] }}-{{ dateTimeArray[1][dateTime[1]] }}-{{ dateTimeArray[2][dateTime[2]] }}
                                    {{ dateTimeArray[3][dateTime[3]] }}:{{ dateTimeArray[4][dateTime[4]] }}:'00'
                                </view>
                            </picker>
                        </view>
                        <view class="remark">
                            <!-- WX2MY: 属性space不被支持，请调整 -->
                            <text space="ensp">备注信息（非必填）：</text>
                            <!-- WX2MY: 属性adjust-position不被支持，请调整。 -->
                            <textarea name="remark" :class="remarkClass"></textarea>
                        </view>
                    </view>
                    <!-- 提示部分 -->
                    <view class="note">
                        <text>注意：此处填写的地址为您自己的取件地址，快递员会前往该地址收取机器，而并非您需要寄送目的地；</text>
                    </view>
                    <button :plain="true" class="yuyue-btn" form-type="submit">立即预约</button>
                    <view data-url="pages/sellerexpress/sellerexpress" :data-order="orderInfo" class="sellerexpress" @tap="toSellerexpress">我要自行邮寄</view>
                </view>
            </form>
            <view style="height: 200rpx; opacity: 0.001">占位</view>
        </view>

        <kefu-cmp></kefu-cmp>
    </view>
</template>
<script module="tool" lang="wxs">
var combineArray = function(array) {
  if (array == undefined) {
    return
  }
  var str = "规格："
  for (var i = 0; i < array.length; i++) {
    str += array[i].feature_name + " " + array[i].option_name + " "
  }
  return str
}
module.exports = {
  combineArray: combineArray
}
</script>
<script>
import headerCmp from '@/components/header/header';
import listmessageCmp from '@/components/listmessage/listmessage';
import kefuCmp from '@/components/kefuservice/kefuservice';
import { tips } from '../../utils/tips';
import { commonDomain as domain } from '../../constant/common';
import { dateTimePicker, getMonthDay, getMaxMonthDay } from '../../utils/util';
export default {
    components: {
        headerCmp,
        listmessageCmp,
        kefuCmp
    },
    data() {
        return {
            domain: domain.domain_qupingce,
            paramData: null,
            userInfo: {},
            //用户信息
            orderInfo: null,
            //上一个页面传递过来的订单信息
            region: [],
            //默认地址
            remarkClass: null,
            dateTimeArray: null,
            dateTime: null,
            orderDate: null,
            //下单时间
            failDate: null,
            //订单失效时间
            failDate1: null,
            //订单失效时间
            startYear: null,
            //开始的年份
            endYear: null,
            //结束的年份
            startMonth: null,
            endMonth: null,
            phoneNumber: '',
            startDay: null,
            //开始的时间
            endDay: null,
            //结束的时间
            flagYear: null //设置一个变量标记上一次选择的年份，以此来判断是否需要重新初始化月份信息
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.paramData = options;
        this.initData(options);
        this.initDate();
        this.setData({
            phoneNumber: uni.getStorageSync('phoneNumber')
        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.initData(this.paramData);
        uni.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    methods: {
        initData(paramData) {
            var _this = this;
            if (paramData.orders == null || paramData.orders == undefined) {
                tips.ERROR_500();
                return;
            }
            let orderStr = decodeURIComponent(paramData.orders); //获得单条订单信息
            //获取下单的时间，提取出来年份和月份
            //wayne（2020-08-07）:这里改为升级多订单发货后，默认选择第一个订单的时间为准JSON.parse(orderStr)[0]
            var order_time = JSON.parse(orderStr)[0].seller_time.replace(/-/g, '/');
            if (order_time == null || order_time == undefined) {
                tips.ERROR_500();
                return;
            }
            var orderDate = new Date(order_time);
            //3天后的时间为
            var failDate = new Date(order_time);
            failDate.setDate(orderDate.getDate() + 2);
            var failDate1 = new Date(order_time);
            failDate1.setDate(orderDate.getDate() + 3);
            _this.setData({
                orderDate: orderDate,
                failDate: failDate,
                failDate1: failDate1,
                startYear: orderDate.getFullYear(),
                //开始的年份
                endYear: failDate.getFullYear(),
                //结束的年份
                startMonth: orderDate.getMonth() + 1,
                //开始月份
                endMonth: failDate.getMonth() + 1,
                //结束月份
                startDay: orderDate.getDate(),
                //开始的时间
                endDay: failDate.getDate(),
                //结束的时间
                flagYear: new Date().getFullYear() //默认为当前所在年份
            });

            let phoneNumber = uni.getStorageSync('phoneNumber'); //从缓存中获取用户的信息
            console.log(phoneNumber);
            if (phoneNumber == null) {
                tips.ERROR_401();
                return;
            } else if (orderStr == null) {
                tips.ERROR_500();
                return;
            }
            _this.setData({
                orderInfo: JSON.parse(orderStr)[0]
            });
        },

        //初始化时间数据
        initDate() {
            //初始化时间的时候需要考虑到天数跨月不一样的情况
            var startMonth = this.startMonth;
            var endMonth = this.endMonth;
            var obj = null;
            if (startMonth != endMonth) {
                //获取下单时间的月份最大天数
                var maxDay = getMaxMonthDay(this.startYear, startMonth);
                if (maxDay == 0) {
                    tips.ERROR_500();
                    return;
                }
                //需要判断是否年份相同
                if (this.startYear != this.endYear) {
                    //获取当前所在时间的年份信息
                    let nowYear = new Date().getFullYear();
                    //如果当前时间和开始年份不相等，那么默认就初始化下一年的数据
                    if (nowYear != this.startYear) {
                        // 获取完整的年月日 时分秒，以及默认显示的数组
                        obj = dateTimePicker(this.startYear, this.endYear, 1, 1, 1, this.endDay);
                    } else {
                        // 获取完整的年月日 时分秒，以及默认显示的数组
                        obj = dateTimePicker(this.startYear, this.endYear, 12, 12, this.startDay, maxDay);
                    }
                } else {
                    //如果年份相同月份不同默认先初始化开始月的数据
                    //判断当前月份是否可开始月份相同
                    let nowMonth = new Date().getMonth() + 1;
                    if (nowMonth == this.startMonth) {
                        obj = dateTimePicker(this.startYear, this.endYear, startMonth, endMonth, this.startDay, maxDay);
                    } else {
                        obj = dateTimePicker(this.startYear, this.endYear, startMonth, endMonth, 1, this.endDay);
                    }
                }
            } else {
                obj = dateTimePicker(this.startYear, this.endYear, startMonth, endMonth, this.startDay, this.endDay);
            }
            // 精确到分的处理，将数组的秒去掉
            var lastArray = obj.dateTimeArray.pop();
            var lastTime = obj.dateTime.pop();
            this.setData({
                dateTimeArray: obj.dateTimeArray,
                dateTime: obj.dateTime
            });
        },

        //时间选择器
        changeDateTime(e) {
            this.setData({
                dateTime: e.detail.value
            });
        },

        withData(param) {
            return param < 10 ? '0' + param : '' + param;
        },

        changeDateTimeColumn(e) {
            var _this = this;
            var arr = this.dateTime;
            var dateArr = this.dateTimeArray;
            arr[e.detail.column] = e.detail.value;
            var startMonth = _this.startMonth;
            var endMonth = _this.endMonth;
            var currYear = dateArr[0][arr[0]]; //获取到当前选中的年份
            var obj = null;
            //如果选择的年份不一样，那么就重新初始化月份信息
            if (currYear != _this.flagYear) {
                if (currYear != _this.startYear) {
                    var endTime =
                        _this.failDate.getFullYear() +
                        '-' +
                        _this.withData(_this.failDate.getMonth() + 1) +
                        '-' +
                        _this.withData(_this.failDate.getDate()) +
                        ' ' +
                        _this.withData(_this.failDate.getHours()) +
                        ':' +
                        _this.withData(_this.failDate.getMinutes()) +
                        ':00';
                    obj = dateTimePicker(_this.startYear, _this.endYear, 1, 1, 1, _this.endDay, endTime); //如果是跨年份的话就设置为下一年的1月份,并且需要传递当前的默认显示时间
                } else {
                    var beginTime =
                        _this.orderDate.getFullYear() +
                        '-' +
                        _this.withData(_this.orderDate.getMonth() + 1) +
                        '-' +
                        _this.withData(_this.orderDate.getDate()) +
                        ' ' +
                        _this.withData(_this.orderDate.getHours()) +
                        ':' +
                        _this.withData(_this.orderDate.getMinutes()) +
                        ':00';
                    obj = dateTimePicker(_this.startYear, _this.endYear, 12, 12, _this.startDay, 31, beginTime); //如果是跨年份的话就设置为下一年的1月份,并且需要传递当前的显示时间信息
                }
                // 精确到分的处理，将数组的秒去掉
                var lastArray = obj.dateTimeArray.pop();
                var lastTime = obj.dateTime.pop();
                _this.setData({
                    dateTimeArray: obj.dateTimeArray,
                    dateTime: obj.dateTime,
                    flagYear: currYear
                });
                return;
            }
            if (startMonth != endMonth) {
                var maxDay = getMaxMonthDay(dateArr[0][arr[0]], startMonth);
                if (maxDay == 0) {
                    tips.ERROR_500();
                    return;
                }
                if (dateArr[1][arr[1]] == (startMonth < 10 ? '0' + startMonth : '' + startMonth)) {
                    dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]], _this.startDay, maxDay);
                } else {
                    dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]], 1, _this.endDay);
                }
            } else {
                dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]], _this.startDay, _this.endDay);
            }
            this.setData({
                dateTimeArray: dateArr,
                dateTime: arr
            });
        },

        //地区选择器
        bindRegionChange: function (e) {
            this.setData({
                region: e.detail.value
            });
        },

        //备注框聚焦时候的函数
        remarkAddClass() {
            this.setData({
                remarkClass: 'heightlight'
            });
        },

        //备注框失去焦点的时候
        remarkRemoveClass() {
            this.setData({
                remarkClass: null
            });
        },

        //表单提交事件
        formSubmit(e) {
            let _this = this;
            /**对数据进行校验 */
            let formData = e.detail.value; //获取表单里面的数据
            if (formData.j_contact == null || formData.j_contact == '') {
                tips.ERROR_500000('请填写联系人');
                return;
            }
            if (!/^[\u4e00-\u9fa5]+$/.test(formData.j_contact)) {
                tips.ERROR_500000('联系人为中文');
                return;
            }
            if (formData.j_contact.length > 10) {
                tips.ERROR_500000('名字长度小于10');
                return;
            }
            if (formData.j_province_city_county == null || formData.j_province_city_county == '') {
                tips.ERROR_500000('请选择省市区');
                return;
            }
            if (formData.j_address == null || formData.j_address == '') {
                tips.ERROR_500000('请填写详细地址');
                return;
            }
            if (formData.sendstarttime == null || formData.sendstarttime == '') {
                tips.ERROR_500000('请选择预约时间');
                return;
            }
            if (formData.remark != null && formData.remark.length > 50) {
                tips.ERROR_500000('备注小于50个字');
                return;
            }
            //获取当前时间到分钟
            let nowDate = new Date();
            let minuteTimeNow = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate() + ' ' + nowDate.getHours() + ':' + nowDate.getMinutes() + ':00';
            let dayTimenow = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate(); //取出时间到天
            if (new Date(formData.sendstarttime.replace(/-/g, '\/')) < new Date(minuteTimeNow)) {
                tips.MODAL('错误提示', '预约的时间必须大于当前时间');
                return;
            }
            if (new Date(formData.sendstarttime.replace(/-/g, '\/')) > _this.failDate1) {
                tips.MODAL('错误提示', '订单有效期至：' + _this.failDate1.toLocaleString());
                return;
            }
            // if ((new Date(formData.sendstarttime.replace(/-/g, "\/"))) > (new Date(dayTimenow + " 17:59:59")) || (new Date(formData.sendstarttime.replace(/-/g, "\/"))) < (new Date(dayTimenow + " 09:00:00"))) {
            //   tips.MODAL('错误提示', '预约时间段为：9:00~18:00')
            //   return
            // }
            //封装请求数据
            //按格式组合多个订单号
            let orderNumbers = _this.orderInfo.order_number;
            let data = {
                order_numbers: orderNumbers,
                j_contact: formData.j_contact,
                //必填
                //j_contact: '15084422026', //必填
                j_province: formData.j_province_city_county.split('|')[0].trim(),
                //必填
                j_city:
                    formData.j_province_city_county.split('|')[1].trim() == '县'
                        ? formData.j_province_city_county.split('|')[0].trim()
                        : formData.j_province_city_county.split('|')[1].trim(),
                //必填
                j_county: formData.j_province_city_county.split('|')[2].trim(),
                //必填
                j_address: formData.j_address,
                //必填
                sendstarttime: formData.sendstarttime,
                //必填【yyyy-MM-dd HH:mm:ss】格式，预约时间段为预约时间段为9：00-18：00！
                remark: formData.remark,
                //非必填（长度小于50）
                token: uni.getStorageSync('token'),
                //必填
                company: 'jd'
            };
            tips.LOADING('订单处理中...');
            uni.request({
                url: `${_this.domain}/place/order/onlineOrder`,
                method: 'POST',
                data: data,
                dataType: 'json',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    uni.hideLoading();
                    if (res.statusCode == 200) {
                        if (res.data.status == 200) {
                            //总数量减去失败数量
                            let sucessCount = _this.orderInfo.length - res.data.data.length;
                            uni.showModal({
                                title: '预约结果',
                                showCancel: false,
                                content: `预约成功`,
                                success(res) {
                                    if (res.confirm) {
                                        uni.switchTab({
                                            url: '/pages/mine/user'
                                        });
                                    } else if (res.cancel) {
                                        uni.switchTab({
                                            url: '/pages/mine/user'
                                        });
                                    }
                                }
                            });
                        } else {
                            tips.MODAL('预约失败', res.data.msg);
                        }
                    } else {
                        tips.ERROR_500();
                    }
                },
                fail: function () {
                    tips.ERROR_500();
                },
                complete: function () {
                    uni.hideLoading();
                }
            });
        },

        toSellerexpress: function (e) {
            var order = e.target.dataset.order;
            let param = [order];
            param = JSON.stringify(param);
            uni.navigateTo({
                url: '/pages/sellerexpress/sellerexpress?orders=' + encodeURIComponent(param)
            });
        },

        /**
         * 订单跳转到详情页面
         */
        toOrderDetail: function (e) {
            var data = JSON.stringify(e.target.dataset.order);
            data = encodeURIComponent(data);
            uni.navigateTo({
                url: '/pages/mine/orderdetails/orderdetail?order=' + data
            });
        }
    }
};
</script>
<style>
.container-online-send {
    background-color: #f7f6fb;
}

.title-img1 {
    width: 100%;
    height: 300rpx;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: #fbfbfb;
    margin-bottom: 16rpx;
}

.title-img1 image {
    width: 90%;
    height: 100%;
}

/**订单信息开始，该样式可以通用**/

.order-has {
    position: relative;
    width: 95%;
    height: auto;
    top: 40rpx;
    left: 2.5%;
    background-color: white;
    margin-bottom: 15px;
    border-radius: 20rpx;
}

.order-has .order-title1 {
    position: relative;
    height: 40rpx;
    width: 94%;
    top: 20rpx;
    margin-right: auto;
    margin-left: auto;
    line-height: 40rpx;
    font-size: 1em;
    padding-top: 10rpx;
}

.order-title1 .order-number {
    float: left;
    margin-left: 0;
    color: #999999;
}

.order-number .text-number {
    color: #999999;
}

.order-title1 .order-status {
    float: right;
    margin-right: 0;
}

.order-status text {
    color: #f56e39;
    font-weight: bold;
    font-size: 25rpx;
}

.order-has .order-main {
    position: relative;
    height: 170rpx;
    width: 94%;
    top: 10rpx;
    margin-left: auto;
    margin-right: auto;
}

.order-main image {
    position: absolute;
    width: 145rpx;
    height: 145rpx;
    top: 30rpx;
    bottom: 0;
    left: 10rpx;
}

.order-main .version-intro {
    position: absolute;
    width: 340rpx;
    height: 210rpx;
    top: 30rpx;
    bottom: 20rxp;
    left: 230rpx;
}

.version-intro .version-title {
    font-size: 1.1em;
    text-align: left;
    color: #212123;
    font-weight: bold;
}

.version-intro .version-deatil {
    margin-top: 10rpx;
    font-size: 0.9em;
    width: 100%;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: normal;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

.version-intro .version-deatil text {
    color: #212123;
}

.order-has .order-other {
    position: relative;
    height: 30rpx;
    width: 100%;
    top: 25rpx;
    left: 0;
    line-height: 30rpx;
}

.order-other text {
    float: left;
}

.order-other .order-other-3 {
    font-size: 0.9em;
}

.order-other .order-other-2,
.order-other .order-other-1 {
    font-size: 1.2em;
    color: #fa6334;
    font-weight: bold;
    font-style: normal;
}

.order-other .order-other-1 {
    margin-right: 10rpx;
}

.order-has .order-button {
    position: relative;
    height: 80rpx;
    width: 94%;
    top: 10rpx;
    left: 0;
    bottom: 30rpx;
    margin-left: auto;
    margin-right: auto;
    /* border-top: 1rpx #f4f4f4 solid; */
}

.order-button navigator,
.order-button .button-view {
    float: right;
    font-size: 0.85em;
    padding: 8rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    border-radius: 40rpx;
    margin-top: 15rpx;
    margin-right: 30rpx;
    color: #555555;
    background-color: #f5f4f9;
}

.order-button .order-button-deatil {
    margin-right: 0 !important;
    background-color: #fcb501 !important;
    color: white !important;
}

.sendOut {
    background-color: #fa6334 !important;
    color: white !important;
    border: none !important;
    padding: 11rpx 32rpx !important;
}
/**订单信息结束，**/

/**表单部分样式开始**/

.container-online-send .formClass {
    font-size: 30rpx;
    color: #333;
    margin-top: 70rpx;
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    background-color: #f7f6fb;
}
.formClass > view {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
    border-radius: 20rpx;
}
.formClass > view view {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20rpx;
    margin-top: 10rpx;
}

.formClass input {
    width: 70%;
}
.formClass .j-contact {
    margin-top: 20rpx;
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    border-bottom: #f1f1f1 solid 2rpx;
}

.formClass .j-phone {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    border-bottom: #f1f1f1 solid 2rpx;
}

.j-phone input {
    color: rgb(0, 0, 0);
}

.formClass .j-province-city-county {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    border-bottom: #f1f1f1 solid 2rpx;
}

.formClass .sendstarttime .date-picker {
    width: 480rpx;
    position: relative;
    display: inline-block;
    padding-top: 10rpx;
}
.formClass .j-address {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    border-bottom: #f1f1f1 solid 2rpx;
}
.formClass .sendstarttime {
    width: 94%;
    height: 60rpx;
    margin-left: auto;
    margin-right: auto;
    border-bottom: #f1f1f1 solid 2rpx;
}
.formClass .remark {
    position: relative;
    height: 200rpx;
}

.formClass .remark text {
    display: inline-block;
    position: absolute;
    top: 14rpx;
}

.formClass .remark textarea {
    display: inline-block;
    width: 94%;
    height: 100rpx;
    margin: auto;
    position: relative;
    top: 28rpx;
    color: #808080;
    font-size: 30rpx;
    font-family: '微软雅黑';
    border-radius: 20rpx;
}

.remark .heightlight {
    /* border: 4rpx solid #ffd22b; */
    background: rgb(243, 243, 243);
}

.formClass .note {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20rpx;
    background-color: #f8f8f8;
    color: #808080;
    font-size: 28rpx;
    line-height: 50rpx;
}

.formClass .yuyue-btn {
    background-image: linear-gradient(to right, #4ba7ec, #297cbb);
    width: 90%;
    text-align: center;
    padding-top: 20rpx;
    padding-bottom: 20rpx;
    margin: auto;
    border-radius: 6rpx;
    margin-bottom: 100rpx;
    margin-top: 40rpx;
    border: none;
    color: white;
    border-radius: 30rpx;
}
.formClass .sellerexpress {
    width: 94%;
    margin-top: -60rpx;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    background-color: #f7f6fb;
    color: #00935f;
    display: block;
}
/**表单部分样式结束**/

.ali-chose-city {
    /* background-color: #ffd22b!important; */
    color: rgb(65, 65, 65);
    font-size: 32rpx;
}

.page-body-button {
    color: rgb(65, 65, 65);
    font-size: 32rpx;
}

.single-tip {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 20rpx;
    margin: 18rpx 0;
    border-radius: 8rpx;
    box-shadow: 5rpx 5rpx 10rpx rgba(179, 190, 209, 0.1);
}

.single-tip text {
    display: block;
}

.order-box {
    width: 92%;
    margin: 0 auto;
}

.single-order {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 25rpx 15rpx 25rpx 25rpx;
    margin: 18rpx 0;
    border-radius: 8rpx;
    box-shadow: 5rpx 5rpx 10rpx rgba(179, 190, 209, 0.1);
}

.main-img {
    width: 130rpx;
    height: 130rpx;
}

.single-order text {
    display: block;
}

.center {
    /* background-color: rgb(84, 230, 198); */
    width: 90%;
}

.title {
    font-weight: bold;
    font-size: 34rpx;
    padding-bottom: 8rpx;
}

.text1 {
    font-size: 22rpx;
    color: rgb(174, 189, 197);
}

.price {
    text-align: right;
    padding-right: 5rpx;
    color: rgb(253, 127, 95);
    font-weight: bold;
}

.right image {
    width: 36rpx;
    height: 36rpx;
}
</style>
