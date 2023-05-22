<template>
    <view class="container">
        <dialog
            id="dialog"
            :title="error.title"
            :content="error.msg"
            :cancelText="error.cancel"
            :confirmText="error.confirm"
            :contact="error.contact"
            @hide="hideDialog($event, { tagId: 'dialog' })"
            @cancelEvent="notAgreedToCancel($event, { tagId: 'dialog' })"
            @confirmEvent="notAgreedToConfirm($event, { tagId: 'dialog' })"
        ></dialog>

        <dialog
            id="dialogSendOut"
            :title="error1.title"
            :content="error1.msg"
            :cancelText="error1.cancel"
            :confirmText="error1.confirm"
            @hide="hideDialogSendOut($event, { tagId: 'dialogSendOut' })"
            @cancelEvent="toSend($event, { tagId: 'dialogSendOut' })"
            @confirmEvent="theDoorToTake($event, { tagId: 'dialogSendOut' })"
        ></dialog>
        <dialog id="action" :title="error3.title" :content="error3.msg" :cancelText="error3.cancel" :confirmText="error3.confirm"></dialog>
        <!-- title -->
        <!-- <view class='header'>
全部订单
  </view> -->

        <!-- 所有订单 -->
        <view class="recent-order">
            <view v-if="waitSendCount > 1" class="send-tip">
                <text>检测到有多个订单待发货，试试一键发货吧～</text>
                <navigator url="/pages/mulitSendOut/mulitSendOut">一键发货</navigator>
            </view>
            <!-- 标题 -->
            <view class="order-title">
                <text>全部订单</text>
            </view>

            <!-- 订单列表 -->
            <view class="order-list">
                <!-- 没有订单 -->
                <view class="order-null" v-if="allOrders.length == 0">
                    <view v-if="allOrders.length == 0 && !dataLoad">
                        <image src="/static/images/noneorder.png"></image>
                        <view class="order-gg">
                            <text>一个订单也没有，</text>
                            <navigator open-type="switchTab" hover-class="nav-to" url="/pages/index/index">逛逛</navigator>
                        </view>
                    </view>
                    <view v-else>
                        <image src="/static/images/dataload.gif"></image>
                    </view>
                </view>
                <!-- 有订单 -->
                <view v-else>
                    <view class="order-has" v-for="(order, index) in allOrders" :key="index">
                        <!-- 1 -->

                        <view class="order-title1">
                            <!-- 订单号 -->
                            <view class="order-number">
                                <text>订单号：</text>
                                <text class="text-number">{{ order.order_number }}</text>
                            </view>
                            <!-- 订单状态 -->
                            <view class="order-status">
                                <text v-if="order.order_status == 'waitdelivery'">等待发货</text>
                                <text v-else-if="order.order_status == 'cancel'">已取消</text>
                                <text v-else-if="order.order_status == 'delivered'">已发货</text>
                                <text v-else-if="order.order_status == 'Receiving'">已收货，正在验机</text>
                                <text v-else-if="order.order_status == 'check'">已收货，正在验机</text>
                                <text v-else-if="order.order_status == 'remit'">等待打款</text>
                                <text v-else-if="order.order_status == 'successfully'">交易成功</text>
                                <text v-else>交易失败</text>
                            </view>
                        </view>

                        <!-- 2 -->

                        <view class="order-main">
                            <!-- 机器图片 -->

                            <image :src="domain + order.img"></image>

                            <!-- 机器简介 -->
                            <view class="version-intro">
                                <view class="version-title">
                                    <text>{{ order.version_name }}</text>
                                </view>
                                <view class="version-deatil">
                                    <text>规格:</text>
                                    <text v-for="(it, index1) in order.phone_info" :key="index1">{{ it.option_name }}</text>
                                </view>
                            </view>
                        </view>

                        <!-- 3 -->

                        <view class="order-other" v-if="order.secondary_recycle != 0">
                            <text class="order-other-1">{{ order.secondary_recycle }}.'00'</text>
                            <text class="order-other-2">￥</text>
                            <text class="order-other-3">二次报价：</text>
                        </view>

                        <view class="order-other" v-else>
                            <text class="order-other-1">{{ order.recycle_money }}.'00'</text>
                            <text class="order-other-2">￥</text>
                            <text class="order-other-3">回收价：</text>
                        </view>

                        <!-- 4 -->

                        <view class="order-button">
                            <view data-url="../orderdetails/orderdetail" :data-order="order" class="order-button-deatil button-view" @tap="toOrderDetail">查看详情</view>
                            <view v-if="order.is_agree_price == 'isagree' && order.order_status != 'successfully' && order.order_status != 'unsuccessful'">
                                <view class="button-view" @tap="yesAgreedTo" :data-ordernumber="order.order_number">我同意报价</view>
                                <view @tap="notAgreedTo" :data-order="order" class="button-view">不同意报价</view>
                            </view>
                            <view class="button-view" v-if="order.is_agree_price == 'False'">未同意报价</view>
                            <view class="button-view" v-if="order.is_agree_price == 'True'">已同意报价</view>
                            <view v-if="order.order_status == 'waitdelivery'" @tap="sendOut" :data-order="order" class="button-view sendOut goSend">去发货</view>
                            <view class="button-view" @tap="delOrder" :data-ordernumber="order.order_number" v-if="order.order_status == 'cancel'">删除订单</view>
                            <view
                                class="button-view"
                                @tap="cancelOrderFun"
                                :data-ordernumber="order.order_number"
                                v-if="order.order_status == 'waitdelivery' || (order.order_status == 'delivered' && order.expree_mode == 'visit')"
                            >
                                取消订单
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view style="opacity: 0.001; height: 350rpx">这个是占位的，免得客服按钮挡住订单</view>
    </view>
</template>

<script>
import dialog from '@/components/Dialog/dialog';
// pages/mine/allorders/allorders.js
const app = getApp();
import { commonDomain as domain } from '../../../constant/common';
export default {
    components: {
        dialog
    },
    data() {
        return {
            domain: domain.domain_qupingce,
            waitSendCount: 0,
            allOrders: [],
            dataLoad: false,

            //数据加载
            error: {
                //弹框消息
                title: '',

                msg: '',
                confirm: '',
                cancel: '',
                contact: ''
            },

            error1: {
                //弹框消息
                title: '',
                msg: '',
                confirm: '',
                cancel: ''
            },

            error3: {
                //操作错误提示
                title: '',
                msg: '',
                confirm: '',
                cancel: ''
            },

            //临时存放订单数据
            cancelOrder: null,

            order: {
                order_number: '',
                order_status: '',
                img: '',
                version_name: '',
                phone_info: [],
                secondary_recycle: 0,
                recycle_money: '',
                is_agree_price: '',
                expree_mode: ''
            },

            it: {
                option_name: ''
            }
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //近期订单
        this.getAllOrders();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //获得dialog组件
        this.dialog = this.zpSelectComponent('#dialog');
        this.dialogSendOut = this.zpSelectComponent('#dialogSendOut');
        //操作提示
        this.action = this.zpSelectComponent('#action');
    },
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
        this.getAllOrders();
        //完成后关闭刷新
        uni.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {
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

        /**
         * 获取近期订单
         *
         */
        getAllOrders: function () {
            var token = uni.getStorageSync('token');
            var that = this;
            that.setData({
                dataLoad: true
            });
            uni.request({
                url: `${domain.domain_qupingce}/view/order/getOrdersByUser`,
                data: {
                    token: token
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                dataType: 'json',
                method: 'POST',
                //get为默认方法/POST
                success: function (r) {
                    if (r.data.status == 200) {
                        //计算待发货的数量,两个及以上就建议一键发货
                        let count = 0;
                        for (let k in r.data.data) {
                            if (r.data.data[k].order_status == 'waitdelivery') {
                                count++;
                            }
                        }
                        that.setData({
                            dataLoad: false,
                            waitSendCount: count,
                            allOrders: r.data.data
                        });
                    }
                },
                fail: function (err) {},
                //请求失败
                complete: function (r) {} //请求完成后执行的函数
            });
        },

        /**
         * 未同意二次报价
         */
        notAgreedTo: function (e) {
            var order = JSON.stringify(e.target.dataset.order);
            order = encodeURIComponent(order);
            this.setData({
                error: {
                    msg: '您可以选择退回机器或联系客服',
                    confirm: '直接退回机器',
                    cancel: '联系客服',
                    contact: true
                },
                cancelOrder: order
            });
            this.dialog.showDialog();
        },

        /**
         * 寄回机器
         */
        notAgreedToConfirm: function (e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            var order = this.cancelOrder;
            uni.navigateTo({
                url: '/pages/returngoods/returngoods?order=' + order
            });
            this.dialog.hideDialog();
        },

        /**
         * 联系客服
         */
        notAgreedToCancel: function (e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            this.dialog.hideDialog();
        },

        /**
         * 是否同意报价隐藏
         */
        hideDialog: function (e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            this.dialog.hideDialog();
        },

        /**
         * 发货
         */
        sendOut: function (e) {
            var order = JSON.stringify(e.target.dataset.order);
            order = encodeURIComponent(order);
            this.setData({
                error1: {
                    msg: '为降低丢件风险，自行寄出仅限于顺丰快递噢~',
                    title: '选择发货方式',
                    confirm: '顺丰上门取件',
                    cancel: '自行寄出'
                },
                cancelOrder: order
            });
            this.dialogSendOut.showDialog();
        },

        /**
         * 自行寄出
         */
        toSend: function (e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            var order = JSON.parse(decodeURIComponent(this.cancelOrder));
            console.log(order.version_name);
            let param = [
                {
                    number: order.order_number,
                    name: order.version_name,
                    price: order.secondary_recycle == 0 ? order.recycle_money : order.secondary_recycle
                }
            ];
            param = JSON.stringify(param);
            uni.navigateTo({
                url: '/pages/sellerexpress/sellerexpress?orders=' + param
            });
            this.dialogSendOut.hideDialog();
        },

        /**
         * 上门取件
         */
        theDoorToTake: function (e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            var order = JSON.parse(decodeURIComponent(this.cancelOrder));
            //console.log(order.version_name)
            let param = [
                {
                    seller_time: order.seller_time,
                    number: order.order_number,
                    name: order.version_name,
                    price: order.secondary_recycle == 0 ? order.recycle_money : order.secondary_recycle
                }
            ];
            param = JSON.stringify(param);
            uni.navigateTo({
                url: '/pages/onlineexpress/onlineexpress?orders=' + param
            });
            this.dialogSendOut.hideDialog();
        },

        /**
         * 去发货隐藏
         */
        hideDialogSendOut: function (e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            this.dialogSendOut.hideDialog();
        },

        /**
         * 删除订单
         */
        delOrder: function (e) {
            var orderNumber = e.target.dataset.ordernumber;
            var token = uni.getStorageSync('token');
            var that = this;
            uni.showModal({
                title: '操作提示',
                content: '您将删除该订单，删除后无法恢复，是否确认此操作？',
                confirmText: '确定',
                cancelText: '取消',
                success: function (res) {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '正在删除',
                            mask: true
                        });
                        uni.request({
                            url: `${domain.domain_qupingce}/action/order/delOrder`,
                            data: {
                                token: token,
                                orderNumber: orderNumber
                            },
                            header: {
                                'Content-Type': 'applciation/json'
                            },
                            method: 'GET',
                            //get为默认方法/POST
                            success: function (r) {
                                uni.hideLoading();
                                if (r.data.status == 200) {
                                    that.setData({
                                        error3: {
                                            //操作错误提示
                                            title: '操作提示',
                                            msg: '订单删除成功！',
                                            confirm: '',
                                            cancel: ''
                                        }
                                    });
                                    that.action.autoHideDialog();
                                    that.getAllOrders();
                                } else if (r.data.status == 501) {
                                    that.resLogin();
                                } else {
                                    that.setData({
                                        error3: {
                                            //操作错误提示
                                            title: '操作提示',
                                            msg: r.data.msg,
                                            confirm: '',
                                            cancel: ''
                                        }
                                    });
                                    that.action.autoHideDialog();
                                }
                            },
                            fail: function (err) {},
                            //请求失败
                            complete: function (r) {} //请求完成后执行的函数
                        });
                    }
                }
            });
        },

        /**
         * 取消订单
         * */
        cancelOrderFun: function (e) {
            var orderNumber = e.target.dataset.ordernumber;
            var token = uni.getStorageSync('token');
            var that = this;
            uni.showModal({
                title: '操作提示',
                content: '您将取消该订单，取消后无法恢复，是否确认此操作？',
                confirmText: '确定',
                cancelText: '取消',
                success: function (res) {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '正在取消',
                            mask: true
                        });
                        uni.request({
                            url: `${domain.domain_qupingce}/action/order/cancelingTheOrder`,
                            data: {
                                token: token,
                                orderNumber: orderNumber
                            },
                            header: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            dataType: 'json',
                            method: 'POST',
                            //get为默认方法/POST
                            success: function (r) {
                                uni.hideLoading();
                                if (r.data.status == 200) {
                                    that.setData({
                                        error3: {
                                            //操作错误提示
                                            title: '操作提示',
                                            msg: '订单取消成功！',
                                            confirm: '',
                                            cancel: ''
                                        }
                                    });
                                    that.action.autoHideDialog();
                                    that.getAllOrders();
                                } else if (r.data.status == 501) {
                                    that.resLogin();
                                } else {
                                    that.setData({
                                        error3: {
                                            //操作错误提示
                                            title: '操作提示',
                                            msg: r.data.msg,
                                            confirm: '',
                                            cancel: ''
                                        }
                                    });
                                    that.action.autoHideDialog();
                                }
                            },
                            fail: function (err) {},
                            //请求失败
                            complete: function (r) {} //请求完成后执行的函数
                        });
                    }
                }
            });
        },

        /**
         * 同意报价
         * */
        yesAgreedTo: function (e) {
            var orderNumber = e.target.dataset.ordernumber;
            var token = uni.getStorageSync('token');
            var that = this;
            uni.showModal({
                title: '操作提示',
                content: '您将同意该订单二次报价，是否确认此操作？',
                confirmText: '确定',
                cancelText: '取消',
                success: function (res) {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '操作中',
                            mask: true
                        });
                        uni.request({
                            url: `${domain.domain_qupingce}/action/order/isAgreeChangePrice`,
                            data: {
                                token: token,
                                order_number: orderNumber,
                                is_agree_price: 'True'
                            },
                            header: {
                                'Content-Type': 'applciation/json'
                            },
                            method: 'get',
                            //get为默认方法/POST
                            success: function (r) {
                                uni.hideLoading();
                                if (r.data.status == 200) {
                                    that.setData({
                                        error3: {
                                            //操作错误提示
                                            title: '操作提示',
                                            msg: '操作成功！',
                                            confirm: '',
                                            cancel: ''
                                        }
                                    });
                                    that.action.autoHideDialog();
                                    that.getAllOrders();
                                } else if (r.data.status == 501) {
                                    that.resLogin();
                                } else {
                                    that.setData({
                                        error3: {
                                            //操作错误提示
                                            title: '操作提示',
                                            msg: r.data.msg,
                                            confirm: '',
                                            cancel: ''
                                        }
                                    });
                                    that.action.autoHideDialog();
                                }
                            },
                            fail: function (err) {},
                            //请求失败
                            complete: function (r) {} //请求完成后执行的函数
                        });
                    }
                }
            });
        },

        /**
         * 501错误重新登录
         */
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
        }
    }
};
</script>
<style>
/* pages/mine/allorders/allorders.wxss */

.container {
    height: auto;
    color: #343d3d;
}

.header {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-image: #fff;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
}

.recent-order {
    position: relative;
    top: 10rpx;
    left: 0;
    width: 100%;
    font-size: 0.8em;
}

.order-title {
    padding-top: 20rpx;
    padding-bottom: 35rpx;
    font-size: 30rpx;
    font-weight: bold;
}

.order-title text {
    padding-left: 1em;
    border-left: 20rpx solid #b55946;
}

.version-intro .version-deatil text {
    color: #9e9e9ec7;
}

.order-list {
    position: relative;
    height: auto;
    width: 100%;
    bottom: 30rpx;
}

.order-list .order-null {
    width: 250rpx;
    height: 280rpx;
    margin-left: auto;
    margin-right: auto;
}

.order-null image {
    position: relative;
    width: 200rpx;
    height: 190rpx;
    top: 0;
    left: 25rpx;
    right: 25rpx;
}

.order-null .order-gg text {
    float: left;
    margin-left: 20rpx;
}

.order-null .order-gg navigator {
    float: left;
    color: rgb(226, 153, 88);
}

.order-null .order-gg {
    position: relative;
    font-size: 0.7em;
    top: 20rpx;
    font-weight: 500;
    color: grey;
}

.nav-to {
    color: grey;
}

.order-has {
    position: relative;
    width: 95%;
    height: auto;
    top: 10rpx;
    left: 2.5%;
    background-color: white;
    margin-bottom: 15rpx;
}

.order-has .order-title1 {
    position: relative;
    height: 40rpx;
    width: 100%;
    top: 0;
    line-height: 40rpx;
    font-size: 1em;
    padding-top: 10rpx;
}

.order-title1 .order-number {
    float: left;
    margin-left: 0;
}

.order-number .text-number {
    color: #999;
}

.order-title1 .order-status {
    float: right;
    margin-right: 0;
}

.order-status text {
    color: #f7866a;
    font-weight: bold;
    font-size: 25rpx;
}

.order-has .order-main {
    position: relative;
    height: 170rpx;
    width: 100%;
    top: 0;
    left: 0;
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
    font-size: 1.2em;
    text-align: left;
    color: #666;
    font-weight: bold;
}

.version-intro .version-deatil {
    margin-top: 10rpx;
    font-size: 0.9em;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.order-has .order-other {
    position: relative;
    height: 30rpx;
    width: 100%;
    top: 0;
    left: 0;
    line-height: 30rpx;
}

.order-other text {
    float: right;
}

.order-other .order-other-3 {
    font-size: 0.9em;
}

.order-other .order-other-2,
.order-other .order-other-1 {
    font-size: 1.2em;
    color: #343d3d;
    font-weight: bold;
    font-style: normal;
}

.order-other .order-other-1 {
    margin-right: 10rpx;
}

.order-has .order-button {
    position: relative;
    height: 80rpx;
    width: 100%;
    top: 0;
    left: 0;
    /* border-top: 1rpx #f4f4f4c4 solid; */
}

.order-button navigator,
.order-button .button-view {
    float: right;
    font-size: 0.85em;
    padding: 8rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    border: 1rpx #c3796a solid;
    border-radius: 40rpx;
    margin-top: 15rpx;
    margin-right: 30rpx;
    color: #343d3d;
}

.order-button .order-button-deatil {
    margin-right: 0 !important;
    background-color: #c3796a;
    color: #fff;
    border: 1rpx #c3796a solid;
}

.sendOut {
    background-color: #f7866a;
    color: white;
    border: none !important;
    padding: 11rpx 32rpx !important;
}
.goSend {
    color: #fff !important;
    background-color: #f7866a !important;
}
.send-tip {
    position: fixed;
    width: 650rpx;
    bottom: 100rpx;
    background: #c3796a;
    border-radius: 50rpx;
    padding: 15rpx 20rpx;
    /* margin: 10rpx 20rpx; */
    left: 50%;
    margin-left: -345rpx;
    color: #fff;
    font-weight: bold;
    display: flex;
    font-size: 24rpx;
    align-items: center;
    justify-content: space-around;
    z-index: 9999;
    box-shadow: 0 0 60rpx rgba(0, 0, 0, 0.24);
}
.send-tip navigator {
    background: #fff;
    border-radius: 30rpx;
    color: #c3796a;
    padding: 10rpx 20rpx;
}
</style>
