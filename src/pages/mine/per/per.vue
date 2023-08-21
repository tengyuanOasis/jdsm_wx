<template>
    <!-- pages/mine/per/per.axml -->
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
                    <image :src="userInfo.avatar"></image>
                </view>
                <!-- 用户信息 -->
                <view class="user-name">
                    <view class="nickName">
                        <text>{{ userInfo.nickName }}</text>
                    </view>
                    <view class="userId" onTap="toBinDing">
                        <text>老用户？去绑定</text>
                    </view>
                </view>
            </view>
            <view v-else class="user">
                <!-- 已授权 -->
                <!-- 头像 -->
                <view class="user-image">
                    <image :src="userInfo.avatar"></image>
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
export default {
    data() {
        return {
            userInfo: {
                avatar: '',
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
        //console.log(userInfo)
        //console.log(userInfo1)
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
@import './per.css';
</style>
