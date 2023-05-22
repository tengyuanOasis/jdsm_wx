<template>
    <view style="height: 100%">
        <view class="container-ex">
            <view class="title">
                <text>填写发货信息</text>
            </view>
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

            <view class="receiveaddress">
                <!-- WX2MY: 属性decode不被支持，请调整 -->
                <text @tap="copyAddress">收货信息：广东省深圳市福田区福田大厦，尖端数码回收收，18475563915</text>
                <view class="copy-btn">
                    <button @tap="copyAddress">点击复制</button>
                </view>
            </view>
            <!-- 订单信息 -->
            <!-- 表单信息开始 -->
            <form @submit="formSubmit" class="formClass">
                <view class="content-box">
                    <view class="express-cl">
                        <!-- WX2MY: 属性space不被支持，请调整 -->
                        <text space="ensp">快递公司：</text>
                        <input type="text" name="companyName" style="display: none" :value="expresses[express_index]" />
                        <view class="picker">
                            <picker onChange="chooseCompany" :value="express_index" :range="expresses">
                                <view>
                                    <image src="/static/images/choose.png"></image>
                                    {{ expresses[express_index] }}
                                </view>
                            </picker>
                        </view>
                    </view>
                    <view class="j_express_number">
                        <text>快递单号：</text>
                        <input type="text" name="j_express_number" placeholder="请输入快递单号" />
                    </view>
                    <view class="remark">
                        <view>
                            <text>备注信息（非必填）：</text>
                        </view>
                        <!-- iOS 系统支付宝客户端版本 10.1.80 及以上不支持 focus=true 自动唤起 -->
                        <textarea name="remark" :class="remarkClass"></textarea>
                    </view>
                </view>
                <!-- 提示部分 -->
                <view class="note">
                    <text>
                        请您使用顺丰快递/京东/EMS，运费由尖端数码承担。如果登录手机号不是您的常用号码，可在备注填写常用手机号等其他备注信息，方便客服与您联系。为了您的货物安全,建议您选择顺丰快递
                    </text>
                </view>
                <button :plain="true" class="yuyue-btn" form-type="submit">提交</button>
            </form>
            <!-- 表单信息结束 -->
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
// pages/sellerexpress/sellerexpress.js
import { tips } from '../../utils/tips';
import { commonDomain as domain } from '../../constant/common';
import { dateTimePicker, getMonthDay } from '../../utils/util';
const app = getApp();
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
            remarkClass: null,
            expressShow: false,
            expresses: ['顺丰快递'],
            express_index: 0 //默认显示顺丰快递
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.paramData = options;
        this.initData(options);
    },
    methods: {
        /**
         * 订单跳转到详情页面
         */
        // toOrderDetail: function(e) {
        //   var data = JSON.stringify(e.target.dataset.order);
        //   data = encodeURIComponent(data);
        //   var url = e.target.dataset.url;
        //   wx.navigateTo({
        //     url: url + "?order=" + data,
        //   })
        // },
        initData(paramData) {
            if (paramData.orders == null || paramData.orders == undefined) {
                tips.ERROR_500();
                return;
            }
            let orderStr = decodeURIComponent(paramData.orders); //获得单条订单信息
            let phoneNumber = uni.getStorageSync('phoneNumber'); //从缓存中获取用户的信息
            if (phoneNumber == null) {
                tips.ERROR_401();
                return;
            } else if (orderStr == null) {
                tips.ERROR_500();
                return;
            }
            this.setData({
                orderInfo: JSON.parse(orderStr)[0]
            });
        },

        //表单提交事件
        formSubmit(e) {
            /**对数据进行校验 */
            let formData = e.detail.value; //获取表单里面的数据
            if (formData.companyName == null || formData.companyName == '') {
                tips.ERROR_500000('请选择快递公司');
                return;
            }
            if (formData.j_express_number == null || formData.j_express_number == '') {
                tips.ERROR_500000('请填写快递单号');
                return;
            }
            if (formData.remark.length > 49) {
                tips.ERROR_500000('备注要求50字内');
                return;
            }
            let _this = this;
            //按格式组合多个订单号
            let orderNumbers = _this.orderInfo.order_number;
            let data = {
                orderNumbers: orderNumbers,
                expree_company: formData.companyName,
                express_number: formData.j_express_number,
                order_remark: formData.remark,
                //50字以内
                token: uni.getStorageSync('token') //身份凭据【必填】
            };

            uni.request({
                url: `${domain.domain_qupingce}/action/order/sendOut`,
                //提交地址
                method: 'POST',
                data: data,
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },

                success(res) {
                    if (res.statusCode == '200') {
                        //请求状态码
                        if (res.data.status == '200') {
                            //后台返回成功状态码
                            uni.showModal({
                                title: '发货结果',
                                content: res.data.msg,
                                showCancel: false,
                                success(re) {
                                    if (re.confirm) {
                                        uni.navigateBack({
                                            delta: 1
                                        });
                                    }
                                }
                            });
                        } else if (res.data.status == '500') {
                            uni.showModal({
                                title: '发货失败',
                                content: '所选订单均已过期，请重新下单',
                                showCancel: false
                            });
                        } else if (res.data.status == '501') {
                            // wx.showModal({
                            //   title: '',
                            //   content: "登录已过期",
                            //   showCancel: false
                            // });
                            _this.resLogin();
                        } else if (res.data.status == '500000') {
                            uni.showModal({
                                title: '',
                                content: '失败，请稍后再试！',
                                showCancel: false
                            });
                        }
                    }
                }
            });
        },

        copyAddress: function () {
            uni.setClipboardData({
                data: '广东省深圳市福田区福田大厦，尖端数码回收收，18475563915',
                success(res) {
                    uni.getClipboardData({
                        success(res) {
                            //console.log(res.data) // data
                        }
                    });
                }
            });
        },

        resLogin: function () {
            var that = this;
            uni.showModal({
                title: '登录提示',
                content: '登录已过期或登录失败，是否重新登录？',
                confirmText: '确定',
                cancelText: '取消',
                success: function (res) {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '登录中...',
                            mask: true
                        });
                        app.globalData.login(); //点击确认就重新登录
                        uni.hideLoading();
                    }
                }
            });
        },

        //选择快递公司
        chooseCompany(e) {
            this.setData({
                express_index: e.detail.value
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
page {
    font-family: '微软雅黑';
    width: 100%;
}

.container-ex {
    width: 100%;
    background-color: #f8f8f8;
}
/*  */
.title {
    position: relative;
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    top: 20rpx;
}
.title text {
    color: #212123;
    font-size: 1.2em;
    font-weight: 600;
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

.container-ex .formClass {
    margin-top: 50rpx;
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 30rpx;
    color: #333;
    background-color: #f8f8f8;
}
.formClass .content-box {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
    border-radius: 20rpx;
}
.formClass view {
    background-color: #fff;
    padding: 20rpx;
    margin-top: 10rpx;
}

.formClass .express-cl {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    flex-wrap: nowrap;
    border-bottom: #f1f1f1 solid 2rpx;
}
.formClass .express-cl > text {
    color: #212123;
    font-weight: 600;
}
.formClass .express-cl .picker {
    width: 70%;
    display: inline-block;
    padding: 0;
    position: relative;
}

.formClass .express-cl .picker image {
    position: absolute;
    right: -32rpx;
    width: 25rpx;
    height: 25rpx;
    top: 34rpx;
}

.j_express_number {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    border-bottom: #f1f1f1 solid 2rpx;
}
.j_express_number > text {
    color: #212123;
    font-weight: 600;
}
.j_express_number input {
    width: 70%;
}

.formClass .remark {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    height: 260rpx;
    border-radius: 20rpx;
}
.formClass .remark > view {
    position: relative;
    width: 100%;
    left: -20rpx;
    border-bottom: #f1f1f1 solid 2rpx;
    height: 50rpx;
}
.formClass .remark text {
    display: inline-block;
    position: absolute;
    font-weight: 600;
    color: #212123;
}

.formClass .remark textarea {
    display: inline-block;
    width: 94%;
    height: 100rpx;
    margin: auto;
    position: relative;
    top: 24rpx;
    color: #808080;
    font-size: 30rpx;
    font-family: '微软雅黑';
    background-color: #f1f1f1;
    border-radius: 20rpx;
}

.remark .heightlight {
    border: 4rpx solid #ffd22b;
}

.formClass .note {
    background-color: #f8f8f8;
    color: #808080;
    font-size: 28rpx;
    line-height: 50rpx;
}

.formClass .yuyue-btn {
    background-image: linear-gradient(to right, #4ba7ec, #2879b8);
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

/**表单部分样式结束**/

.order-button {
    height: 70rpx;
    width: 96%;
    background: white;
    font-size: 25rpx;
    border-top: 1px solid #f6f6f6;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row-reverse;
    align-items: center;
}

.order-button-deatil {
    padding: 10rpx 30rpx 10rpx 30rpx;
    background: #ffd128;
}

.receiveaddress {
    margin-top: 100rpx;
    width: 94%;
    height: 230rpx;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    background-color: white;
    border-radius: 20rpx;
}

.receiveaddress text {
    margin-top: 20rpx;
    display: inline-block;
    width: 94%;
    line-height: 50rpx;
    text-align: left;
    color: #614f3b;
    font-size: 24rpx;
}
.copy-btn {
    width: 94%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30rpx;
    margin-bottom: 20rpx;
}

.copy-btn button {
    float: right;
    padding: 10rpx;
    font-size: 26rpx;
    width: 150rpx;
    height: 50rpx;
    text-align: center;
    line-height: 30rpx;
    border-radius: 25rpx;
    background-color: #019bfc;
    color: white;
}

/*  */

.company-cl .hightlight {
    background-color: #ade1f5;
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
