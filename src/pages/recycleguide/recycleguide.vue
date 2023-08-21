<template>
    <view style="height: 100%">
        <!-- pages/recycleguide/recycleguide.axml -->
        <!-- 回收指南 -->
        <header-cmp :isShow="false">
            <view slot="question">
                <text>回收指南</text>
            </view>
        </header-cmp>
        <view class="main-box">
            <view class="pic">
                <listmessage-cmp>
                    <text slot="before" style="color: #999999; font-size: 35rpx">回收流程示意图</text>
                </listmessage-cmp>
                <view class="container-guide">
                    <view class="onetap">
                        <image src="/static/components/guides/images/search.png" style="width: 55rpx; height: 55rpx" />
                        <text>选择机型</text>
                    </view>
                    <view class="onetap">
                        <image src="/static/components/guides/images/price.png" style="width: 55rpx; height: 55rpx" />
                        <text>免费估价</text>
                    </view>
                    <view class="onetap">
                        <image src="/static/components/guides/images/order.png" style="width: 55rpx; height: 55rpx" />
                        <text>下单发货</text>
                    </view>
                    <view class="onetap">
                        <image src="/static/components/guides/images/pay.png" style="width: 55rpx; height: 55rpx" />
                        <text>验货打款</text>
                    </view>
                </view>
            </view>
            <view class="im">
                <image src="/static/images/use_pic.png" style="height: 1100rpx" />
            </view>
            <view style="height: 200rpx; opacity: 0.001">placeholder</view>
        </view>
    </view>
</template>

<script>
import headerCmp from '@/components/header/header';
import listmessageCmp from '@/components/listmessage/listmessage';

// pages/recycleguide/recycleguide.js
export default {
    components: {
        headerCmp,
        listmessageCmp
    },
    data() {
        return {};
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},
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
    onPullDownRefresh: function () {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {}
};
</script>
<style>
@import './recycleguide.css';
</style>
