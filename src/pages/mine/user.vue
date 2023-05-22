<template>
    <view style="height: 100%">
        <!-- 我的 -->
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

            <!-- 用户信息栏 -->
            <view class="user-info">
                <view style="width: 100%; height: 100%; z-index: 1"></view>
                <view v-if="!hasUserInfo && canIUse" class="user">
                    <!-- 未授权 -->
                    <!-- 头像 -->
                    <view class="user-image">
                        <image src="/static/images/peishi.jpg"></image>
                    </view>
                    <!-- 用户信息 -->
                    <view class="user-name">
                        <view class="nickName">
                            <text>{{ phoneNumber ? phoneNumber : '' }}</text>
                        </view>
                        <view class="userId">
                            <!-- <text>我的电话</text> -->
                        </view>
                    </view>
                </view>
                <view v-else-if="!userInfo1" class="user">
                    <!-- 已授权 -->
                    <!-- 头像 -->
                    <view class="user-image">
                        <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
                            <image :src="avatarUrl"></image>
                        </button>
                    </view>
                    <!-- 用户信息 -->
                    <view class="user-name">
                        <view class="nickName">
                            <text>{{ phoneNumber ? phoneNumber : '' }}</text>
                        </view>
                        <view class="userId">
                            <!-- <text>我的电话</text> -->
                        </view>
                    </view>
                </view>
            </view>

            <!-- 近期订单 -->
            <view class="recent-order">
                <!-- 标题 -->
                <view class="order-title">
                    <text>我的订单</text>
                </view>
                <!-- 订单列表 -->
                <view class="order-list">
                    <!-- 没有订单 -->
                    <view class="order-null" v-if="recentOrders.length == 0">
                        <view v-if="recentOrders.length == 0 && !dataLoad">
                            <view class="order-gg">
                                <text>一个订单也没有</text>
                            </view>
                        </view>
                        <view v-else>
                            <image src="/static/images/dataload.gif"></image>
                        </view>
                    </view>
                    <!-- 有订单 -->
                    <view v-else>
                        <view class="order-has" v-for="(order, index) in recentOrders" :key="index">
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
                                        <text wx:index="index" v-if="index < 5" v-for="(it, index1) in order.phone_info" :key="index1">{{ it.option_name }}</text>
                                    </view>
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

                            <!-- 3 -->

                            <!-- <view class="order-other" wx:if="{{order.secondary_recycle!=0}}">
            <text class="order-other-1">{{order.secondary_recycle}}.'00'</text>
            <text class="order-other-2">￥</text>
            <text class="order-other-3">二次报价：</text>
          </view>
          <view class="order-other" wx:else>
            <text class="order-other-1">{{order.recycle_money}}.'00'</text>
            <text class="order-other-2">￥</text>
            <text class="order-other-3">回收价：</text>
          </view> -->

                            <!-- 4 -->

                            <view class="order-button">
                                <view data-url="orderdetails/orderdetail" :data-order="order" class="order-button-deatil button-view" @tap="toOrderDetail">查看详情</view>
                                <view v-if="order.is_agree_price == 'isagree' && order.order_status != 'successfully' && order.order_status != 'unsuccessful'">
                                    <view class="button-view" @tap="yesAgreedTo" :data-ordernumber="order.order_number">同意报价</view>
                                    <view @tap="notAgreedTo" :data-order="order" class="button-view">不同意报价</view>
                                </view>
                                <view class="button-view" v-if="order.is_agree_price == 'False'">未同意报价</view>
                                <view class="button-view" v-if="order.is_agree_price == 'True'">已同意报价</view>
                                <view v-if="order.order_status == 'waitdelivery'" @tap="sendOut" :data-order="order" class="button-view sendOut">去发货</view>
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
            <!-- 底部弹出框 start -->
            <view class="dialog_screen" v-if="showModalStatus"></view>
            <view :animation="animationData" class="dialog_attr_box" v-if="showModalStatus">
                <view style="background: white; position: relative; overflow: hidden">
                    <view class="dialog_title">
                        <!-- <text>您还未登录，请选择您的身份（什么是老用户？在小程序发布前已拥有回收账户。什么是新用户？在小程序发布前未拥有回收账户。若账户已绑定小程序或已注册的用户选择直接登录）</text> -->
                        <text class="waytitle">需要您的授权才能登录查看订单</text>
                    </view>
                </view>
                <view class="btn-box">
                    <!-- <button hover-class='none' class='button2' open-type="getUserInfo" bindgetuserinfo="getUserInfo" data-url='/pages/mine/per/updateinfo/updateinfo'>新用户登录</button> -->
                    <button hover-class="none" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="button4">点击授权登录</button>
                </view>
            </view>
            <!-- 底部弹出框 end -->
        </view>
        <kefu-cmp></kefu-cmp>
    </view>
</template>

<script>
import dialog from '@/components/Dialog/dialog';
import kefuCmp from '@/components/kefuservice/kefuservice';
// pages/mine/user.js
import { commonDomain as domain } from '../../constant/common';
const app = getApp();
export default {
    components: {
        dialog,
        kefuCmp
    },
    data() {
        return {
            domain: domain.domain_qupingce,
            waitSendCount: 0,
            avatarUrl: '/static/images/peishi.jpg',
            userInfo: {},

            //微信用户信息
            hasUserInfo: false,

            hasPhoneNumber: false,
            canIUse: uni.canIUse('button.open-type.getUserInfo'),
            userInfo1: null,

            //初始值
            recentOrders: [],

            //近期订单
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

            //点击不同意报价订单item
            cancelOrder: null,

            phoneNumber: '',
            showModalStatus: false,
            animationData: '',

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
        console.log(uni.getStorageSync('phoneNumber'));
        this.setData({
            phoneNumber: uni.getStorageSync('phoneNumber').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        });
        //头像
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.globalData.userInfoReadyCallback = (res) => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
            };
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            uni.getUserInfo({
                success: (res) => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            });
        }
        var token = uni.getStorageSync('token');
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //获得dialog组件
        this.dialog = this.zpSelectComponent('#dialog');
        this.dialogSendOut = this.zpSelectComponent('#dialogSendOut');
        //操作提示
        this.action = this.zpSelectComponent('#action');
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var token = uni.getStorageSync('token');
        if (!token) {
            this.showModalUser();
        } else {
            //回收用户信息（不需要了）
            // this.app.login(that.getUserData)();
            //近期订单
            this.getRecentOrders();
            //console.log(990)
        }
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
        //下拉刷新重新获取用户信息
        // this.app.login(that.getUserData)();
        //近期订单
        this.getRecentOrders();
        //完成后关闭刷新
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
        /**
         * 授权
         */
        getUserInfo: function (e) {
            if (e.detail.userInfo) {
                //允许
                this.setData({
                    userInfo: e.detail.userInfo,
                    hasUserInfo: true,
                    canIUse: uni.canIUse('button.open-type.getUserInfo')
                });
                var url = e.target.dataset.url;
                if (url) {
                    uni.navigateTo({
                        url: url
                    });
                    this.setData({
                        showModalStatus: false
                    });
                }
            } else {
                uni.showToast({
                    title: '未同意授权',
                    image: '/static/images/icon/500000_error.png',
                    duration: 2000,
                    mask: true
                });
            }

            //授权的同时并登录
            //app.login(this.getUserData);
        },

        /**
         * 跳转到全部订单页面
         */
        gotoAllOrders: function (e) {
            //未授权无法跳转到个人资料
            if (!this.hasUserInfo && this.canIUse) {
                uni.showToast({
                    title: '未授权',
                    image: '/static/images/icon/500000_error.png',
                    duration: 2000,
                    mask: true
                });
                return;
            } else {
                uni.navigateTo({
                    url: 'allorders/allorders'
                });
            }
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

        /**
         * 跳转到我的优惠卷页面去
         */
        gotoCoupons: function () {
            //未授权无法跳转到个人资料
            if (!this.hasUserInfo && this.canIUse) {
                uni.showToast({
                    title: '未授权',
                    image: '/static/images/icon/500000_error.png',
                    duration: 2000,
                    mask: true
                });
                return;
            } else {
                uni.navigateTo({
                    url: 'coupons/coupons'
                });
            }
        },

        /**
         * 条转到个人资料页面
         */
        toUserDetail: function (e) {
            //未授权无法跳转到个人资料
            if (!this.hasUserInfo && this.canIUse) {
                uni.showToast({
                    title: '未授权',
                    image: '/static/images/icon/500000_error.png',
                    duration: 2000,
                    mask: true
                });
            } else {
                var userInfo = JSON.stringify(e.target.dataset.userinfo);
                var userInfo1 = JSON.stringify(e.target.dataset.userinfo1);
                var url = e.target.dataset.url;
                uni.navigateTo({
                    url: url + '?userInfo=' + userInfo + '&userInfo1=' + userInfo1
                });
            }
        },

        /**
         * 获取用户信息
         */
        getUserData: function (token1) {
            var that = this;
            var token;
            if (token1) {
                token = token1;
            } else {
                token = uni.getStorageSync('token');
            }
            if (!token) {
                //如果没有token就不需要去获取用户信息
                return false;
            }
            uni.request({
                url: `${domain.domain_qupingce}/user/getuserinfo`,
                data: {
                    token: token
                },
                header: {
                    'Content-Type': 'applciation/json'
                },
                method: 'GET',
                //get为默认方法/POST
                success: function (r) {
                    uni.hideLoading();
                    if (r.data.status == 200) {
                        uni.setStorageSync('userInfo', r.data.data);
                        that.setData({
                            userInfo1: r.data.data
                        });
                    } else {
                        //that.resLogin(); //登录过期重新登录
                    }
                },
                fail: function (err) {},
                //请求失败
                complete: function (r) {} //请求完成后执行的函数
            });
        },

        /**
         * 获取近期订单
         *
         */
        getRecentOrders: function () {
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
                    'Content-Type': 'application/x-www-form-urlencoded',
                    firm: 'jd'
                },
                dataType: 'json',
                method: 'POST',
                //get为默认方法/POST
                success: function (r) {
                    that.setData({
                        dataLoad: false
                    });
                    if (r.data.status == 200) {
                        //  console.log(r.data.data)
                        //计算待发货的数量,两个及以上就建议一键发货
                        let count = 0;
                        for (let k in r.data.data) {
                            if (r.data.data[k].order_status == 'waitdelivery') {
                                count++;
                            }
                        }
                        //只取前5
                        r.data.data = r.data.data.slice(0, 5);
                        that.setData({
                            recentOrders: r.data.data,
                            waitSendCount: count
                        });
                    } else {
                        that.resLogin(); //登录过期重新登录
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
                url: '../../../../returngoods/returngoods?order=' + order
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
         * 发货
         */
        sendOut: function (e) {
            //春节暂停代码start
            var curTime = new Date();
            var startTime = new Date(Date.parse('2022-01-24 00:00:00'.replace(/-/g, '/')));
            var endTime = new Date(Date.parse('2022-02-07 15:00:00'.replace(/-/g, '/')));
            if ((curTime.getTime() >= startTime.getTime()) & (curTime.getTime() <= endTime.getTime())) {
                uni.showModal({
                    title: '放假提醒',
                    content: '(2022.01.27~2022.02.07)春节放假，8日正常上班，订单超时不发货将过期，需重新估价下单，请合理安排发货时间）',
                    confirmText: 'OK',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                        }
                    }
                });
            }
            //春节暂停代码end
            var order = JSON.stringify(e.target.dataset.order);
            order = encodeURIComponent(order);
            this.setData({
                error1: {
                    msg: '为降低丢件风险，自行寄出仅限于使用顺丰快递哦～',
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
            //console.log(order.version_name)
            let param = [order];
            param = JSON.stringify(param);
            uni.navigateTo({
                url: '/pages/sellerexpress/sellerexpress?orders=' + encodeURIComponent(param)
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
            let param = [order];
            param = JSON.stringify(param);
            uni.navigateTo({
                url: '/pages/onlineexpress/onlineexpress?orders=' + encodeURIComponent(param)
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
         * 是否同意报价隐藏
         */
        hideDialog: function (e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            this.dialog.hideDialog();
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
                                    uni.showToast({
                                        title: '删除成功',
                                        icon: 'none'
                                    });
                                    that.getRecentOrders();
                                } else if (r.data.status == 501) {
                                    that.resLogin();
                                } else {
                                    uni.showToast({
                                        title: r.data.msg,
                                        icon: 'none'
                                    });
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
                                    uni.showToast({
                                        title: '取消成功',
                                        icon: 'none'
                                    });
                                    that.getRecentOrders();
                                } else if (r.data.status == 501) {
                                    that.resLogin();
                                } else {
                                    uni.showToast({
                                        title: r.data.msg,
                                        icon: 'none'
                                    });
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
                                    uni.showToast({
                                        title: '操作成功',
                                        icon: 'none'
                                    });
                                    that.getRecentOrders();
                                } else if (r.data.status == 501) {
                                    that.resLogin();
                                } else {
                                    uni.showToast({
                                        title: r.data.msg,
                                        icon: 'none'
                                    });
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
            let that = this;
            uni.showModal({
                title: '登录提示',
                content: '登录已过期或登录失败，请重新登录（需先授权）',
                confirmText: '立即登录',
                cancelText: '关闭提示',
                showCancel: true,
                success(res) {
                    // console.log('111')
                    if (res.confirm) {
                        // console.log('222')
                        uni.showLoading({
                            title: '登录中...',
                            mask: true
                        });
                        //app.login(that.getUserData); //点击确认就重新登录
                        app.globalData.login();
                        setTimeout(() => {
                            that.getRecentOrders();
                        }, 2000);
                        uni.hideLoading();
                    }
                }
            });
        },

        showModalUser: function () {
            // 显示遮罩层
            var animation = uni.createAnimation({
                duration: 200,
                timingFunction: 'linear',
                delay: 0
            });
            this.animation = animation;
            animation.translateY(300).step();
            this.setData({
                animationData: animation.export(),
                showModalStatus: true
            });
            setTimeout(
                function () {
                    animation.translateY(0).step();
                    this.setData({
                        animationData: animation.export()
                    });
                }.bind(this),
                200
            );
        },

        hideModalUser: function () {
            // 隐藏遮罩层
            var animation = uni.createAnimation({
                duration: 200,
                timingFunction: 'linear',
                delay: 0
            });
            this.animation = animation;
            animation.translateY(300).step();
            this.setData({
                animationData: animation.export()
            });
            setTimeout(
                function () {
                    animation.translateY(0).step();
                    this.setData({
                        animationData: animation.export(),
                        showModalStatus: false
                    });
                }.bind(this),
                200
            );
        },

        /**
         * 解密手机号
         */
        getPhoneNumber(e) {
            let self = this;
            console.log(e);
            if (e.detail.iv) {
                //用户点了允许授权
                /*  console.log(e.detail.errMsg)
         console.log(e.detail.iv)
         console.log(e.detail.encryptedData) */
                uni.request({
                    url: `${domain.domain_qupingce}/user/wx/getPhoneNumber`,
                    data: {
                        code: uni.getStorageSync('powerCode'),
                        encryptedData: e.detail.encryptedData,
                        iv: e.detail.iv
                    },
                    header: {
                        'Content-Type': 'applciation/json',
                        firm: 'jd'
                    },
                    method: 'get',
                    //get为默认方法/POST
                    success: function (r) {
                        uni.hideLoading();
                        if (r.data.code == 200) {
                            //console.log(r.data);
                            uni.setStorageSync('phoneNumber', r.data.token.phoneNumber);
                            self.setData({
                                hasPhoneNumber: true
                            });
                            self.nowLogin();
                        } else {
                            // self.setData({
                            //   error3: { //操作错误提示
                            //     title: "操作提示",
                            //     msg: r.data.msg,
                            //     confirm: '',
                            //     cancel: ''
                            //   }
                            // })
                            // self.action.autoHideDialog();
                        }
                    },
                    fail: function (err) {},
                    //请求失败
                    complete: function (r) {} //请求完成后执行的函数
                });
                //this.nowLogin();
            } else {
                uni.showToast({
                    title: '需授权后使用',
                    image: '/static/images/icon/500000_error.png',
                    duration: 2000,
                    mask: true
                });
            }
        },

        /**
         * 直接登录
         */
        nowLogin: function (e) {
            /* this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
      }) */
            uni.showLoading({
                title: '登录中...',
                mask: true
            });
            //app.login(this.app.login(that.getUserData));
            //不必强制获取用户头像了
            app.globalData.login();
            uni.hideLoading();
            var that = this;
            setTimeout(function () {
                var token = uni.getStorageSync('token');
                if (token) {
                    that.hideModalUser();
                    //近期订单
                    that.getRecentOrders();
                }
            }, 2000);
        },

        onChooseAvatar(e) {
            const { avatarUrl } = e.detail;
            this.setData({
                avatarUrl
            });
        }
    }
};
</script>
<style>
/* pages/mine/user.wxss */

.container {
    margin: 0;
    height: 100%;
    width: 100%;
    padding: 0;
    background: #f7f6fb;
}

/*  */

.user-info {
    position: relative;
    top: -30rpx;
    left: 0;
    width: 100%;
    height: 230rpx;
    background: #4ba7ec;
    background-repeat: repeat-y;
}

.user {
    width: 80%;
    /* margin-left: 50rpx; */
    height: 200rpx;
    display: flex;
    /* flex-direction: column; */
    margin: 30rpx auto;
    z-index: 99;
    margin-top: -230rpx;
}

.user-image {
    margin-left: 2rpx;
    margin-top: 40rpx;
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    z-index: 99;
    overflow: hidden;
}
.user-name {
    float: right;
    width: 60%;
    height: 50rpx;
    margin-left: 10rpx;
    align-self: center;
    justify-self: center;
    z-index: 99;
}

.nickName {
    color: white;
    font-weight: bold;
    font-size: 1.1em;
    display: block;
    -webkit-margin-before: 0.4em;
    -webkit-margin-after: 0.5em;
    -webkit-margin-start: 0rpx;
    -webkit-margin-end: 0rpx;
    z-index: 99;
}

.userId {
    color: white;
    font-size: 0.8em;
    display: block;
    -webkit-margin-before: 0.4em;
    -webkit-margin-after: 0.3em;
    -webkit-margin-start: 0rpx;
    -webkit-margin-end: 0rpx;
    z-index: 99;
}

.user-image image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 75rpx;
    z-index: 99;
}

/*  */

.recent-order {
    position: relative;
    top: 10rpx;
    left: 0;
    width: 100%;
    font-size: 0.8em;

    background-color: #f7f6fb;
}

.order-title {
    padding-top: 20rpx;
    padding-bottom: 35rpx;
    font-size: 35rpx;
    font-weight: bolder;
}

.order-title text {
    padding-left: 1em;
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
    font-size: 1.2em;
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

/* dialog start */

.dialog_screen {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.1;
    overflow: hidden;
    z-index: 1000;
    color: #fff;
}

.dialog_attr_box {
    width: 98%;
    height: auto;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    left: 1%;
    right: 1%;
    z-index: 2000;
    background: #fff;
    padding-top: 1px;
    border-top-left-radius: 2%;
    border-top-right-radius: 2%;
    text-align: center;
}

.dialog_title {
    font-size: 16px;
    height: auto;
    display: flex;
    padding: 10px;
    text-align: center;
}

.dialog_title text {
    width: 100%;
}

.dialog_attr_box .btn-box {
    position: relative;
    top: 0;
    width: 100%;
    text-align: center;
    min-height: 270rpx;
}

.dialog_attr_box .button1,
.dialog_attr_box .button2,
.dialog_attr_box .button4 {
    width: 88%;
    margin-left: auto;
    margin-right: auto;
    padding: 20rpx;
    margin-top: 20rpx;
    color: white;
}

.dialog_attr_box .button1 {
    background-color: rgb(255, 221, 96);
    font-size: 28rpx;
    color: rgb(94, 66, 26);
}

.dialog_attr_box .button2 {
    background-color: rgb(255, 220, 95);
    font-size: 28rpx;
    color: rgb(94, 66, 26);
}

.dialog_attr_box .button4 {
    background-color: #4ba7ec;
    font-size: 28rpx;
    color: #eafde7;
}

.waytitle {
    font-weight: bold;
    font-size: 36rpx;
}

.send-tip {
    background: rgb(255, 94, 82);
    border-radius: 50rpx;
    padding: 15rpx 20rpx;
    margin: 10rpx 20rpx;
    color: #fff;
    font-weight: bolder;
    font-weight: 1900;
    display: flex;
    font-size: 24rpx;
    align-items: center;
    justify-content: space-around;
}

.send-tip navigator {
    background: #fff;
    border-radius: 30rpx;
    color: rgb(255, 108, 82);
    padding: 10rpx 20rpx;
    font-weight: bolder;
}

.send-tip text {
    font-weight: bolder;
}
</style>
