<template>
    <!-- pages/mine/orderdetails/orderdetail.axml -->
    <view class="container" style="background-color: #f7f6fb">
        <!-- title -->
        <!-- <view class="header">
		{{order.version_name}}
  </view> -->
        <view class="title">
            <text>订单信息</text>
        </view>
        <!-- 订单详情 -->
        <view class="order-detail">
            <!-- 图 -->
            <!-- <view class="order-image">
      <image src="https://www.qupingce.com{{order.img}}" mode="widthFix"></image>
    </view> -->
            <!-- 标题 -->

            <view class="order-main">
                <!-- 机器图片 -->
                <image :src="domain + order.img"></image>
                <!-- 机器简介 -->
                <view class="version-intro">
                    <view class="version-title">
                        <text>{{ order.version_name }}</text>
                    </view>
                    <view class="version-deatil"></view>
                    <view class="order-other" v-if="order.secondary_recycle != 0">
                        <text class="order-other-3">二次报价：</text>
                        <text class="order-other-2">￥</text>
                        <text class="order-other-1">{{ order.secondary_recycle }}.'00'</text>
                    </view>
                    <view class="order-other" v-else>
                        <text class="order-other-3">回收价：</text>
                        <text class="order-other-2">￥</text>
                        <text class="order-other-1">{{ order.recycle_money }}.'00'</text>
                    </view>
                </view>
            </view>

            <view class="order-detail-item">
                <text class="order-detail-item-title">订单编号：</text>
                <text>{{ order.order_number }}</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">机器型号：</text>
                <text>{{ order.version_name }}</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">订单状态：</text>
                <text class="order-status" v-if="order.order_status == 'waitdelivery'">等待发货</text>
                <text class="order-status" v-else-if="order.order_status == 'cancel'">已取消</text>
                <text class="order-status" v-else-if="order.order_status == 'delivered'">已发货</text>
                <text class="order-status" v-else-if="order.order_status == 'Receiving'">已收货，正在验机</text>
                <text class="order-status" v-else-if="order.order_status == 'check'">已收货，正在验机</text>
                <text class="order-status" v-else-if="order.order_status == 'remit'">等待打款</text>
                <text class="order-status" v-else-if="order.order_status == 'successfully'">交易成功</text>
                <text class="order-status" v-else>交易失败</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">下单时间：</text>
                <text>{{ order.seller_time }}</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">系统估价：</text>
                <text>￥{{ order.recycle_money }}.'00'</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">活动加价:</text>
                <text>￥{{ order.markup_money }}.'00'</text>
            </view>
            <view class="order-detail-item" v-if="order.secondary_recycle != 0">
                <text class="order-detail-item-title">二次报价：</text>
                <text>￥{{ order.secondary_recycle }}.'00'</text>
            </view>
            <view class="order-detail-item" v-if="order.secondary_recycle != 0">
                <text class="order-detail-item-title">报价备注：</text>
                <text>{{ order.price_change_remark }}</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">收款方式：</text>
                <text>{{ order.money_account_type }}</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">收款账户：</text>
                <text>{{ order.collect_money_account }}</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">收款姓名：</text>
                <text>{{ order.collect_money_account_name }}</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">机器来源：</text>
                <text>{{ order.source }}</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">机器IMEI：</text>
                <text v-if="order.imei">{{ order.imei }}</text>
                <text v-else>无</text>
            </view>
            <view class="order-detail-item">
                <text class="order-detail-item-title">用户备注：</text>
                <text v-if="order.remark">{{ order.remark }}</text>
                <text v-else>无</text>
            </view>
            <navigator :url="'/pages/mine/route/route?expressNum=' + order.express_number + '&exprssCompany=' + order.expree_company" hover-class="none" class="order-detail-item">
                <text class="order-detail-item-title">物流信息：</text>
                <text>{{ order.expree_company }}-{{ order.express_number }}</text>
                <text style="color: #019bfc">(点击查看物流)</text>
            </navigator>
        </view>
        <!-- 机器详情 -->

        <view class="title" style="margin-top: 50rpx">
            <text>机器信息</text>
        </view>
        <view class="order-detail version-detail">
            <view class="order-detail-item" v-for="(it, index) in order.phone_info" :key="index">
                <text class="order-detail-item-title">{{ it.feature_name }}：</text>

                <text>{{ it.option_name }}</text>
            </view>
        </view>
        <view class="report-btn">
            <button @tap="toTestReport" :data-imei="order.imei" :data-myorderid="order.myorder_id" :data-name="order.version_name">查看验机报告</button>
        </view>
        <view style="height: 100rpx; background-color: #f7f6fb"></view>
    </view>
</template>

<script>
// pages/mine/orderdetails/orderdetail.js
import { commonDomain as domain } from '../../../constant/common';
export default {
    data() {
        return {
            domain: domain.domain_qupingce,

            order: {
                img: '',
                version_name: '',
                secondary_recycle: 0,
                recycle_money: '',
                order_number: '',
                order_status: '',
                seller_time: '',
                markup_money: '',
                price_change_remark: '',
                money_account_type: '',
                collect_money_account: '',
                collect_money_account_name: '',
                source: '',
                imei: '',
                remark: '',
                express_number: '',
                expree_company: '',
                phone_info: [],
                myorder_id: ''
            },

            it: {
                feature_name: '',
                option_name: ''
            }
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        //初始化订单数据
        var data = options.order;
        data = decodeURIComponent(data);
        var order = JSON.parse(data);
        console.log(order);
        this.setData({
            order: order
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        //完成后关闭刷新
        uni.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {
        toTestReport: function (e) {
            uni.navigateTo({
                url: '/pages/testReport/testReport?myorder_id=' + e.target.dataset.myorderid + '&imei=' + e.target.dataset.imei + '&name=' + e.target.dataset.name
            });
        }
    }
};
</script>
<style>
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
/*  */

.order-detail {
    position: relative;
    width: 94%;
    height: auto;
    top: 40rpx;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
    border-radius: 30rpx;
    padding-top: 50rpx;
    padding-bottom: 50rpx;
}

.order-detail .order-main {
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
    font-size: 1em;
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
    height: 25rpx;
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
    font-size: 1em;
}

.order-other .order-other-2,
.order-other .order-other-1 {
    font-size: 1em;
    color: #fa6334;
    font-weight: bold;
    font-style: normal;
}

.order-other .order-other-1 {
    margin-right: 10rpx;
}

.order-detail .order-image {
    width: 100%;
    height: 210rpx;
    /* box-shadow: 10px 10px 10px #bfbfbe2e; */
    background: white;
    overflow: hidden;
    text-align: center;
}

.order-image image {
    width: 300rpx;
    height: 160rpx;
}

.order-title {
    position: relative;
    border-left: 20rpx #ffd22b solid;
    width: 70%;
    top: 50rpx;
    left: 0;
    padding-left: 30rpx;
}

.order-title text {
    font-size: 1em;
}

.order-detail-item {
    position: relative;
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20rpx;
    color: #999;
    word-wrap: break-word;
    height: auto !important;
    text-align: left !important;
}
.order-detail-item-title {
    color: #000;
}
.order-detail-item text {
    font-size: 0.8em;
}

.version-detail {
    top: 30rpx;
    height: 600rpx !important;
}
.report-btn {
    height: 100rpx;
    width: 100%;
    margin-top: 100rpx;
}
.report-btn button {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to right, #4ba7ec, #2b7ab8);
    line-height: 100rpx;
    color: white;
}
</style>
