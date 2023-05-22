<template>
    <view class="retrun-container">
        <view class="title">
            <text>填写退货信息</text>
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
            <view class="order-button"></view>
        </view>
        <view style="height: 10rpx"></view>
        <view class="form-box">
            <form @submit="bindFormSubmit">
                <view class="c-box">
                    <view class="thecontent">
                        <label>收货姓名：</label>
                        <input placeholder="请输入收货姓名" :focus="true" name="sellername" />
                    </view>
                    <view class="thecontent">
                        <label>手机号码：</label>
                        <input placeholder="请输入手机号码" name="phone" />
                    </view>
                    <view class="thecontent2" onTap="changefocus">
                        <view class="borderclass">
                            <label class="tarea_label">详细退回地址：</label>
                            <textarea class="tarea" name="address"></textarea>
                        </view>
                    </view>
                </view>
                <view class="note">
                    <view class="checkCode">很遗憾没能与您完成交易，在您提交完整地址信息后，工作人员一般会在当日晚八点前寄出快递退回您的机器</view>
                </view>
                <button form-type="submit" class="btn1">提交</button>
            </form>
        </view>

        <view style="height: 100rpx"></view>
    </view>
</template>

<script>
import headerCmp from '@/components/header/header';
import listmessageCmp from '@/components/listmessage/listmessage';
// pages/returngoods/returngoods.js
import { commonDomain as domain } from '../../constant/common';
import { tips } from '../../utils/tips';
const app = getApp();
export default {
    components: {
        headerCmp,
        listmessageCmp
    },
    data() {
        return {
            hasOrder: false,
            domain: domain.domain_qupingce,
            userInfo: null,
            orderInfo: null,
            areaf: false
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.order == null || options.order == undefined) {
            tips.ERROR_500();
            return;
        }
        var order = decodeURIComponent(options.order);
        let userInfo = uni.getStorageSync('userInfo'); //从缓存中获取用户的信息

        if (userInfo == null) {
            tips.ERROR_401();
            return;
        } else if (order == null) {
            tips.ERROR_500();
            return;
        }
        this.setData({
            userInfo: userInfo,
            orderInfo: JSON.parse(order),
            hasOrder: true
        });
    },
    methods: {
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

        changefocus(e) {
            //地址输入框改变焦点事件
            this.setData({
                areaf: true
            });
        },

        /**
         * 订单跳转到详情页面
         */
        toOrderDetail: function (e) {
            var data = JSON.stringify(e.target.dataset.order);
            data = encodeURIComponent(data);
            var url = e.target.dataset.url;
            uni.navigateTo({
                url: url + '?order=' + data
            });
        },

        bindFormSubmit(e) {
            if (!this.hasOrder) {
                uni.showModal({
                    title: '',
                    content: '暂无订单可退！',
                    showCancel: false,
                    success(re) {
                        if (re.confirm) {
                            uni.navigateBack({});
                        }
                    }
                });
                return;
            }
            var mobilereg = /^1([3589][0-9]|4[579]|66|7[0135678]|9[189])[0-9]{8}$/;
            var sellername = e.detail.value.sellername;
            var phone = e.detail.value.phone;
            var address = e.detail.value.address;
            if (sellername == '') {
                uni.showModal({
                    title: '',
                    content: '名字长度或格式错误',
                    showCancel: false
                });
                return;
            }
            if (phone == '' || !mobilereg.test(phone)) {
                uni.showModal({
                    title: '',
                    content: '请输入正确的手机号',
                    showCancel: false
                });
                return;
            }
            if (address == '') {
                uni.showModal({
                    title: '',
                    content: '地址不能为空',
                    showCancel: false
                });
                return;
            }
            let _this = this;
            let data = {
                order_number: _this.orderInfo.order_number,
                is_agree_price: 'False',
                //用户不同意二次报价
                return_name: sellername,
                //收件人地址【必填】
                return_phone: phone,
                //收件人电话【必填】
                return_address: address,
                //收件人地址【必填】
                token: uni.getStorageSync('token') //身份凭据【必填】
            };

            uni.request({
                url: `${domain.domain_qupingce}/action/order/isAgreeChangePrice`,
                //提交地址
                method: 'GET',
                data: data,
                header: {
                    'content-type': 'application/json' // 默认值
                },

                success(res) {
                    if (res.statusCode == '200') {
                        //请求状态码
                        if (res.data.status == '200') {
                            //后台返回成功状态码
                            uni.showModal({
                                title: '',
                                content: '退件信息已成功提交！',
                                showCancel: false,
                                success(re) {
                                    if (re.confirm) {
                                        uni.navigateBack({});
                                    }
                                }
                            });
                        } else if (res.data.status == '500') {
                            uni.showModal({
                                title: '',
                                content: res.data.msg,
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
        }
    }
};
</script>
<style>
page {
    font-family: '微软雅黑';
}

.retrun-container {
    width: 100%;
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

.form-box {
    width: 100%;
    margin: 60rpx auto;
}
..form-box label {
    color: #333;
}
.form-box .c-box {
    width: 94%;
    height: 500rpx;
    margin: 60rpx auto;
    background-color: white;
    border-radius: 30rpx;
}

.thecontent {
    margin-top: 50rpx;
    width: 94%;
    margin: 50rpx auto 10rpx auto;
    height: 80rpx;
    background: #fff;
    display: flex;
    flex-direction: row;
    font-size: 30rpx;
    align-items: center;
    justify-content: center;
    border-bottom: 2rpx solid #f1f1f1;
    padding-bottom: 5rpx;
}

.thecontent label {
    width: 23%;
    margin-left: 4%;
    margin-right: 6%;
    line-height: 80rpx;
    display: inline-block;
}

.thecontent input {
    height: 80rpx;
    width: 60%;
    background: white;
}

.thecontent2 {
    height: 230rpx;
    font-size: 30rpx;
    background: white;
    display: flex;
    flex-direction: column;
    position: relative;
}

.borderclass {
    position: absolute;
    width: 92%;
    left: 4%;
    height: 100%;
    padding-top: 20rpx;
}

/* .borderclass_{
  position: absolute;
  width: 92%;
  left: 4%;
  height: 100%;
  border: 3rpx solid #A6C8FF;
} */

.thecontent2 textarea {
    width: 100%;
    height: 130rpx;
    background: rgb(245, 245, 245);
}

.btn-area {
    margin: 0rpx 20rpx 0rpx 20rpx;
    /* (上，右，下，左) */
    font-size: 35rpx;
    height: 70rpx;
    line-height: 70rpx;
    text-align: center;
    vertical-align: center;
    margin-top: 10rpx;
    border-radius: 6rpx;
    background: #ffcb19;
}

.note {
    margin-top: 20rpx;
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 20rpx;
}

.checkCode {
    margin: 0rpx 20rpx 0rpx 20rpx;
    /* (上，右，下，左) */
    background: #f8f8f6;
    height: 80rpx;
    font-size: 27rpx;
    line-height: 40rpx;
    color: grey;
}
.btn1 {
    background-image: linear-gradient(to right, #4ba7ec, #2887cf);
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
</style>
