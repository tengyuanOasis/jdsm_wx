<template>
    <!-- pages/mine/per/per.wxml -->
    <view class="container">
        <!-- title -->
        <view class="header"></view>

        <!-- 用户信息栏 -->
        <view class="user-info">
            <view v-if="!hasUserInfo && canIUse" class="user">
                <!-- 未授权 -->
                <!-- 鸭子 -->
                <view class="user-image">
                    <image src="/static/images/LOGO.png"></image>
                </view>
                <!-- 用户信息 -->
                <view class="user-name">
                    <view class="nickName">
                        <button open-type="getUserInfo" @getuserinfo="getUserInfo">去授权</button>
                    </view>
                    <view class="userId">
                        <text>ID：xxx</text>
                    </view>
                </view>
            </view>
            <view v-else-if="!userInfo1" class="user">
                <!-- 已授权 -->
                <!-- 头像 -->
                <view class="user-image">
                    <image :src="userInfo.avatarUrl"></image>
                </view>
                <!-- 用户信息 -->
                <view class="user-name">
                    <view class="nickName">
                        <text>{{ userInfo.nickName }}</text>
                    </view>
                    <view class="userId" @tap="toBinDing">
                        <text>老用户？去绑定</text>
                    </view>
                </view>
            </view>
            <view v-else class="user">
                <!-- 已授权 -->
                <!-- 头像 -->
                <view class="user-image">
                    <image :src="userInfo.avatarUrl"></image>
                </view>
                <!-- 用户信息 -->
                <view class="user-name">
                    <view class="nickName">
                        <text>{{ userInfo1.seller_phone }}</text>
                    </view>
                    <view class="userId">
                        <!-- <text>我的电话</text> -->
                    </view>
                </view>
            </view>
        </view>

        <!-- 其他个人资料 -->
        <view>
            <view class="weui-cells__title">绑定手机号：</view>
            <navigator :url="'updateinfo/updateinfo?seller_phone=' + userInfo1.seller_phone" class="weui-cells weui-cells_after-title">
                <view class="weui-cell weui-cell_access">
                    <view class="weui-cell__bd" v-if="!userInfo1.seller_phone">未绑定</view>
                    <view class="weui-cell__bd" v-else>{{ userInfo1.seller_phone }}</view>
                    <view class="weui-cell__ft weui-cell__ft_in-access" style="font-size: 0">
                        <view class="weui-badge weui-badge_dot" style="margin-left: 5px; margin-right: 5px"></view>
                    </view>
                </view>
            </navigator>
        </view>
    </view>
</template>

<script>
// pages/mine/per/per.js
export default {
    data() {
        return {
            userInfo: {
                avatarUrl: '',
                nickName: ''
            },

            //微信用户信息
            //初始值
            userInfo1: null,

            hasUserInfo: '',
            canIUse: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        //初始化用户信息
        var userInfo = JSON.parse(options.userInfo);
        var userInfo1 = JSON.parse(options.userInfo1);
        this.setData({
            userInfo: userInfo,
            userInfo1: userInfo1
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
        uni.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {
        /**
         * 去绑定页面
         */
        toBinDing: function () {
            uni.navigateTo({
                url: 'binding/binding'
            });
        },

        getUserInfo() {
            console.log('占位：函数 getUserInfo 未声明');
        }
    }
};
</script>
<style>
/* pages/mine/per/per.wxss */
.header {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ffba5e), color-stop(1, #ffd22b));
}

.header view {
    float: left;
    margin-left: 10rpx;
}

.header image {
    width: 60rpx;
    height: 60rpx;
    margin-top: 10rpx;
}

.header .logout {
    float: right;
    margin-right: 10rpx;
}

/*  */

.user-info {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 184rpx;
    background: #ffd22b;
}

.user {
    width: 60%;
    /* margin-left: 50rpx; */
    height: 154rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

.user-image {
    width: 150rpx;
    height: 150rpx;
    /* float: left; */
}

.user-name {
    /* float: left; */
}
.nickName {
    font-weight: bold;
    font-size: 1.1em;
    display: block;
    -webkit-margin-before: 0.4em;
    -webkit-margin-after: 0.5em;
    -webkit-margin-start: 0rpx;
    -webkit-margin-end: 0rpx;
}

.userId {
    font-size: 0.8em;
    display: block;
    -webkit-margin-before: 0.4em;
    -webkit-margin-after: 0.3em;
    -webkit-margin-start: 0rpx;
    -webkit-margin-end: 0rpx;
}

.user-image image {
    width: 140rpx;
    height: 140rpx;
    /* border: 5rpx #f4f4f4 solid; */
    border-radius: 200rpx;
    box-shadow: 0 0 100rpx rgb(219, 127, 7);
}

/* weui */
.weui-cells {
    position: relative;
    margin-top: 1.17647059em;
    background-color: #fff;
    line-height: 1.41176471;
    font-size: 1em;
}

.weui-cells:before {
    top: 0;
    border-top: 1rpx solid #eeeeee;
}

.weui-cells:after,
.weui-cells:before {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    color: #eeeeee;
}

.weui-cells:after {
    bottom: 0;
    border-bottom: 1rpx solid #eeeeee;
}

.weui-cells__title {
    margin-top: 0.77em;
    margin-bottom: 0.3em;
    padding-left: 15px;
    padding-right: 15px;
    color: #999;
    font-size: 14px;
}

.weui-cells_after-title {
    margin-top: 0;
}

.weui-cells__tips {
    margin-top: 0.3em;
    color: #999;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 14px;
}

.weui-cells__title {
    margin-top: 0.77em;
    margin-bottom: 0.3em;
    padding-left: 15px;
    padding-right: 15px;
    color: #999;
    font-size: 14px;
}

.weui-cell {
    padding: 10px 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.weui-cell:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1rpx solid #d9d9d9;
    color: #d9d9d9;
    left: 15px;
}

.weui-cell:first-child:before {
    display: none;
}

.weui-cell_active {
    background-color: #ececec;
}

.weui-cell_primary {
    -webkit-box-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start;
}

.weui-cell__bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}

.weui-cell__ft {
    text-align: right;
    color: #999;
}

.weui-cell_access {
    color: inherit;
}

.weui-cell__ft_in-access {
    padding-right: 13px;
    position: relative;
}

.weui-cell__ft_in-access:after {
    content: ' ';
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #c8c8cd;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 2px;
}

.weui-cell_link {
    color: #586c94;
    font-size: 14px;
}

.weui-cell_link:active {
    background-color: #ececec;
}

.weui-cell_link:first-child:before {
    display: block;
}
.weui-icon-radio {
    margin-left: 3.2px;
    margin-right: 3.2px;
}

.weui-icon-checkbox_circle,
.weui-icon-checkbox_success {
    margin-left: 4.6px;
    margin-right: 4.6px;
}

.weui-check__label:active {
    background-color: #ececec;
}
</style>
